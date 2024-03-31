from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.pagination import PageNumberPagination
from .models import Contact
from .serializer import ContactSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

class ContactCreateView(generics.CreateAPIView):
    """
    Summary:
        View To Create A Contact

    Args:
        Method: POST
        first_name, last_name, email_address 
    """
    permission_classes = [permissions.IsAuthenticated]
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class ContactDetailView(generics.RetrieveAPIView):
    """
    Summary:
        View To See Details Of A Specific Contact

    Args:
        Method: GET
        contact_id: Id of the contact the user would like to see details of  
    """
    permission_classes = [permissions.IsAuthenticated]
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

class ContactUpdateView(generics.UpdateAPIView):
    """
    Summary:
        View To Update Details Of A Contact
    Args:
        Method: PUT/PATCH
        first_name, last_name, email_address,
        contact_id: Id of the contact the user would like to update details of 
    """
    permission_classes = [permissions.IsAuthenticated]
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

class ContactDeleteView(generics.DestroyAPIView):
    """
    Summary:
        View To Delete Contact(s)
    Args:
        Method: DELETE
        contact_ids: The contacts that the user wants to delete 
    """
    permission_classes = [permissions.IsAuthenticated]
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    def delete(self, request, *args, **kwargs):
        contact_ids_str = request.query_params.get('contact_ids', None)
        if contact_ids_str:
            contact_ids = contact_ids_str.split(',')
            try:
                for contact_id in contact_ids:
                    contact = get_object_or_404(Contact, pk=contact_id)
                    contact.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            except Contact.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class ContactListView(generics.ListAPIView):
    """
    Summary:
        View To See All Contacts Of A User
    Args:
        Method: GET
    """
    permission_classes = [AllowAny]
    serializer_class = ContactSerializer
    pagination_class = PageNumberPagination
    queryset = Contact.objects.all()