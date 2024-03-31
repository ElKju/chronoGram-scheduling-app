from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django.contrib.auth import login, logout
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer

User = get_user_model()

class RegisterView(APIView):
    """Register a new user.

    Args:
        Method: POST
        Payload: username, password, first_name, last_name, email
        request (Request): The HTTP request object.

    Returns:
        Response: The HTTP response object.
    """
    permission_classes = [AllowAny]
    def post(self, request):
        
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    """Login a user and generate access and refresh tokens.

    Args:
        Method: POST
        Payload: username, password
        request (Request): The HTTP request object.

    Returns:
        Response: The HTTP response object.
    """
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = User.objects.filter(username=username).first()
        if user and user.check_password(password):
            login(request, user)
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    """Logout the current user.

    Args:
        Method: POST
        Payload: N/A
        request (Request): The HTTP request object.

    Returns:
        Response: The HTTP response object.
    """
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        logout(request)
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)

class AccountEditView(APIView):
    """Edit the current user's account details.

    Args:
        Method: PUT
        Payload: username, password, first_name, last_name, email
        request (Request): The HTTP request object.

    Returns:
        Response: The HTTP response object.
    """
    permission_classes = (IsAuthenticated,)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
