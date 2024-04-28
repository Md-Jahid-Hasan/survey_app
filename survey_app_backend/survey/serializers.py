from rest_framework import serializers

from survey.models import Survey, Question, Option, Response


class OptionSerializer(serializers.ModelSerializer):
    """Serializer for Option object. A additional field answer will be added to the options which indicate is the
    option already selected by the user."""
    answer = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Option
        fields = ['id', 'option_text', 'is_correct', 'question', 'answer']
        extra_kwargs = {'question': {'write_only': True, 'required': False},
                        'is_correct': {'write_only': True}, 'id': {'read_only': True}}

    def get_answer(self, obj):
        question = obj.question
        user = self.context['request'].user
        return obj.response_set.filter(user__user=user, user__survey=question.survey).exists()


class QuestionSerializer(serializers.ModelSerializer):
    """This is serialized question object. text_answer field will populate with user answer if provided."""
    options = OptionSerializer(many=True, required=False)
    text_answer = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'question', 'question_type', 'options', 'survey', 'text_answer']
        extra_kwargs = {'survey': {'write_only': True, 'required': False}, 'id': {'read_only': True}}

    def get_text_answer(self, obj):
        user = self.context['request'].user
        survey = obj.survey
        response = obj.response_set.filter(user__user=user, user__survey=survey, option=None)
        if response.exists():
            return response.first().text_answer
        else:
            return ""

    def create(self, validated_data):
        options = validated_data.pop('options', None)
        question = super().create(validated_data)
        if validated_data.get('question_type') != 'TF':
            option_serializer = OptionSerializer(data=options, many=True)
            option_serializer.is_valid(raise_exception=True)
            option_serializer.save(question=question)


class SurveySerializer(serializers.ModelSerializer):
    """This serializer is used for return the list of surveys and create new survey object."""
    questions = QuestionSerializer(many=True, write_only=True)
    is_joined = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Survey
        fields = ['title', 'started_at', 'ended_at', 'created_by', 'is_ended', 'survey_time', 'questions', 'is_joined', 'id']
        read_only_fields = ('is_ended', 'survey_time', 'id')

    def get_is_joined(self, obj):
        request = self.context.get('request')
        return obj.participants.filter(participatinguser__user=request.user).exists()

    def validate(self, attrs):
        if attrs.get('ended_at') < attrs.get('started_at'):
            raise serializers.ValidationError("End time should be greater than started time")
        return super().validate(attrs)

    def create(self, validated_data):
        questions = validated_data.pop('questions')
        survey = super().create(validated_data)

        question_serializer = QuestionSerializer(data=questions, many=True)
        question_serializer.is_valid()
        question_serializer.save(survey=survey)
        return survey


# class ResponseSubmitSerializer(serializers.ModelSerializer):
#     question = serializers.PrimaryKeyRelatedField(queryset=Question.objects.all())
#     option = serializers.PrimaryKeyRelatedField(queryset=Option.objects.all())
#
#     class Meta:
#         model = Response
#         fields = ['user', 'question', 'text_answer', 'option']
#         extra_kwargs = {'user': {'write_only': True, 'required': False}}


class SurveyDetailsSerializer(serializers.ModelSerializer):
    """This serializer use for getting survey details with question, options and answer"""
    questions = QuestionSerializer(many=True)
    is_submitted = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Survey
        fields = ['title', 'survey_time', 'questions', 'ended_at', 'is_ended', 'is_submitted']

    def get_is_submitted(self, obj):
        user = self.context['request'].user
        user_participation = obj.participatinguser_set.filter(user=user)
        if user_participation.exists():
            return user_participation.first().submitted
        return False


