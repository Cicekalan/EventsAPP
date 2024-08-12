from .authentication import JWTAuthentication
from rest_framework import viewsets
from .models import Event,UserEvent
from .serializers import EventSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('-id')
    serializer_class = EventSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


class JoinEventView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, event_id):
        user = request.user
        print(f"User ID: {user.id}") 

        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            print(f"Event with ID {event_id} not found.")
            return Response({"detail": "Event not found."}, status=status.HTTP_404_NOT_FOUND)

        if UserEvent.objects.filter(userId=user.id, eventId=event_id).exists():
            print(f"User with ID {user.id} has already joined event with ID {event_id}.")
            return Response({"detail": "You have already joined this event."}, status=status.HTTP_400_BAD_REQUEST)

        UserEvent.objects.create(userId=user.id, eventId=event_id)
        print(f"User with ID {user.id} successfully joined event with ID {event_id}.")
        return Response({"detail": "You have successfully joined the event."}, status=status.HTTP_200_OK)
    

class GetJoinEventView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print(request)
        try:
            user = request.user

            event_ids = UserEvent.objects.filter(userId=user.id).values_list('eventId', flat=True)
            event_id_list = list(event_ids)
            
            print(f"User ID {user.id} has joined the following event IDs: {event_id_list}")

            return Response(event_id_list, status=status.HTTP_200_OK)
        
        except Exception as e:
            print(f"An error occurred while fetching joined events for user {user.id}: {e}")
            return Response({"detail": "An error occurred while processing your request."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)