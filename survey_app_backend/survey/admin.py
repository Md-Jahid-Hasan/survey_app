from django.contrib import admin
from .models import Survey, Question, Option, ParticipatingUser, Response

# Register your models here.

admin.site.register(Survey)
admin.site.register(Response)


class ResponseInline(admin.TabularInline):
    model = Response
    readonly_fields = ['question']


class ParticipatingUserModelAdmin(admin.ModelAdmin):
    inlines = [ResponseInline]


admin.site.register(ParticipatingUser, ParticipatingUserModelAdmin)


class QuestionInline(admin.TabularInline):
    model = Option


class QuestionAdmin(admin.ModelAdmin):
    inlines = [QuestionInline]


admin.site.register(Question, QuestionAdmin)
