from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.ReportViewSet, basename='report')

urlpatterns = [
    path('submit/', views.ReportViewSet.as_view({'post': 'create'}), name='submit-report'),
    path('<int:pk>/comments/', views.ReportViewSet.as_view({'post': 'add_comment'}), name='report-comments'),
    path('', include(router.urls)),
]
