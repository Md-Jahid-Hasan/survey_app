import datetime
import pytz

from django.utils import timezone
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Survey, ParticipatingUser, Response as SurveyResponse, Question, Option
from .serializers import SurveySerializer, ResponseSubmitSerializer, SurveyDetailsSerializer


class SurveyListView(ListCreateAPIView):
    serializer_class = SurveySerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        order_by = self.request.query_params.get('order_by', None)
        if order_by:
            return Survey.objects.all().order_by('created_at')
        return Survey.objects.all()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class SurveyParticipateView(APIView):
    permission_classes = (IsAuthenticated,)

    def get_object(self, **kwargs):
        lookup_field = kwargs.get('id')
        try:
            return Survey.objects.get(id=lookup_field)
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

        # body = request.data
        # response_serializer = SurveyDetailsSerializer(data=body)
        # response_serializer.is_valid(raise_exception=True)
        # response_serializer.save(user=is_participating)

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
