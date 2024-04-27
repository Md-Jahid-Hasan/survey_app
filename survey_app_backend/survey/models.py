from django.utils import timezone
from django.db import models
from django.conf import settings


class ParticipatingUser(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    survey = models.ForeignKey("Survey", on_delete=models.CASCADE)
    submitted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.name} join in {self.survey.title}"


class Survey(models.Model):
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField()
    ended_at = models.DateTimeField()
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='participate_users', blank=True,
                                          through=ParticipatingUser)

    class Meta:
        ordering = ['started_at']

    @property
    def is_ended(self):
        return timezone.now() > self.ended_at

    @property
    def survey_time(self):
        return (self.ended_at - self.started_at) / 60

    def __str__(self):
        return self.title


class Question(models.Model):
    QUESTION_TYPES = (
        ('TF', 'Text Field'),
        ('RF', 'Radio Field'),
        ('CB', 'Check Box'),
    )
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, related_name='questions')
    question = models.CharField(max_length=100)
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES)

    def __str__(self):
        return self.question


class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    option_text = models.CharField(max_length=100)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.option_text


class Response(models.Model):
    user = models.ForeignKey(ParticipatingUser, on_delete=models.CASCADE, related_name='user_responses')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    text_answer = models.CharField(max_length=100, null=True, blank=True)
    option = models.ForeignKey(Option, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.question.question
