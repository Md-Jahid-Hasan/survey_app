import math

from django.utils import timezone
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Survey, ParticipatingUser, Response as SurveyResponse, Question, Option
from .serializers import SurveySerializer, SurveyDetailsSerializer


class SurveyListView(ListCreateAPIView):
    """This view responsible for implementing business logic for return list of surveys and create surveys.
    List of surveys is returned with pagination."""
    serializer_class = SurveySerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        order_by = self.request.query_params.get('order', "started")
        start = int(self.request.query_params.get('start', 0))
        end = int(self.request.query_params.get('end', 5))
        if order_by == "created":
            return Survey.objects.all().order_by('created_at')[start:end]
        return Survey.objects.all()[start:end]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def list(self, request, *args, **kwargs):
        response = super(SurveyListView, self).list(request, *args, **kwargs)
        total_data = Survey.objects.all().count()
        total_pages = math.ceil(total_data / 5)
        new_response = {
            "survey": response.data,
            "total_pages": total_pages
        }
        response.data = new_response
        return response


class SurveyParticipateView(APIView):
    """This view implements business logic for returned a specefic survey also save response/answer of user. Based on
    user already join the survey or not it return the survey if not join with get method user can join a survey.
    with patch request a specific answer will save. PUT request will finally call when survey end."""
    permission_classes = (IsAuthenticated,)

    def get_object(self, **kwargs):
        lookup_field = kwargs.get('id')
        try:
            return Survey.objects.prefetch_related('questions').get(id=lookup_field)
        except Survey.DoesNotExist:
            return None

    def get(self, request, *args, **kwargs):
        survey = self.get_object(**kwargs)
        if not survey:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'message': 'Survey does not exist'})

        user = request.user
        is_participating = ParticipatingUser.objects.filter(user=user, survey=survey).exists()
        if not is_participating:
            if survey.ended_at < timezone.now():
                return Response(status=status.HTTP_400_BAD_REQUEST, data={'message': 'Survey Finished'})
            survey.participants.add(user)

        response_data = SurveyDetailsSerializer(survey, context={'request': self.request})

        return Response(status=status.HTTP_200_OK, data=response_data.data)

    def put(self, request, *args, **kwargs):
        survey = self.get_object(**kwargs)
        if not survey:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'message': 'Survey does not exist'})

        try:
            is_participating = ParticipatingUser.objects.get(user=request.user, survey=survey)
        except ParticipatingUser.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data={'message': 'You are not allowed to submit surveys'})

        if survey.ended_at < timezone.now():
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'message': 'Survey Finished'})

        is_participating.submitted = True
        is_participating.save()

        return Response(status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        survey = self.get_object(**kwargs)
        if not survey:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'message': 'Survey does not exist'})

        try:
            is_participating = ParticipatingUser.objects.get(user=request.user, survey=survey)
        except ParticipatingUser.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data={'message': 'You are not allowed to submit surveys'})

        if survey.ended_at < timezone.now():
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'message': 'Survey Finished'})

        body = request.data
        for submission in body:
            option_id = submission.get('option', None)
            text = submission.get('text_answer', None)

            try:
                question = Question.objects.get(pk=submission['question'])

                if option_id:
                    option = Option.objects.get(pk=option_id)
                    question_type = question.question_type

                    if question_type == "CB":
                        response_query = {"defaults": {"user": is_participating}, "question": question, "option": option}
                    elif question_type == "RF":
                        response_query = {"defaults": {"option": option, "user": is_participating}, "question": question}
                    answer, is_created = SurveyResponse.objects.get_or_create(**response_query)

                    if not is_created:
                        if question_type == "RF":
                            answer.option = option
                            answer.save()
                        else:
                            answer.delete()
                else:
                    answer, is_created = SurveyResponse.objects.get_or_create(
                        defaults={"user": is_participating, "text_answer": text}, question=question)
                    if not is_created:
                        answer.text_answer = text
                        answer.save()
            except:
                return Response(status=status.HTTP_400_BAD_REQUEST, data={'message': 'Bad data provided'})

        return Response(status=status.HTTP_200_OK)
