from django.contrib import admin
from .models import Survey, Question, Option, ParticipatingUser, Response
# Register your models here.

admin.site.register(Survey)
admin.site.register(Question)
admin.site.register(Option)
admin.site.register(ParticipatingUser)
admin.site.register(Response)
