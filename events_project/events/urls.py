from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, JoinEventView, GetJoinEventView

router = DefaultRouter()
router.register(r'events', EventViewSet)

urlpatterns = [
    path('', include(router.urls)), 
    path('events/<int:event_id>/join/', JoinEventView.as_view(), name='join_event'),
    path('api/events/getJoinEvent/', GetJoinEventView.as_view(), name='get_join_event'),
    path('api/test/', GetJoinEventView.as_view(), name='test_get_join_event'),
]
