from django.urls import path
from .views import SurveyListView, SurveyParticipateView

app_name = 'survey'

urlpatterns = [
    path('list/', SurveyListView.as_view(), name='login'),
    path('participate/<int:id>/', SurveyParticipateView.as_view(), name='participate')
]