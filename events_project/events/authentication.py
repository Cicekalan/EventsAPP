from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import requests
from django.contrib.auth.models import User

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        token = auth_header.split(' ')[1] if ' ' in auth_header else None
        if not token:
            raise AuthenticationFailed('Token not Found!')

        response = requests.get('http://host.docker.internal:5024/api/User/validate', headers={'Authorization': f'Bearer {token}'})
        if response.status_code != 200:
            raise AuthenticationFailed('Invalid or expired token')

        user_data = response.json()
        user, _ = User.objects.get_or_create(username=user_data['username'])
        return (user, None)