from django.urls import path
from Contacts.views import ContactCreateView, ContactDeleteView, ContactDetailView, ContactListView, ContactUpdateView

urlpatterns = [
    path('contacts/create/', ContactCreateView.as_view(), name='contact-create'),
    path('contacts/<int:pk>/details/', ContactDetailView.as_view(), name='contact-detail'),
    path('contacts/<int:pk>/edit/', ContactUpdateView.as_view(), name='contact-edit'),
    path('contacts/delete/', ContactDeleteView.as_view(), name='contact-delete'),
    path('contacts/list/all/', ContactListView.as_view(), name='contact-list'),
]