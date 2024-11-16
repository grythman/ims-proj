from rest_framework import views, permissions
from rest_framework.response import Response
from rest_framework.decorators import permission_classes
from rest_framework import status

class DashboardView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        try:
            # Add your dashboard data logic here
            data = {
                'status': 'success',
                'message': 'Dashboard data retrieved successfully',
                'data': {
                    # Add your dashboard data here
                    'example': 'data'
                }
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class StatsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        try:
            # Add your stats logic here
            data = {
                'status': 'success',
                'message': 'Stats retrieved successfully',
                'data': {
                    # Add your stats data here
                    'example': 'stats'
                }
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
