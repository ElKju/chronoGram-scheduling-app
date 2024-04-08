from django.urls import path
from .views import RegisterView, LoginView, LogoutView, AccountEditView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

app_name = 'Accounts'

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('account/edit/', AccountEditView.as_view(), name='account_edit'),
    path('login/', LoginView.as_view(), name='login'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]