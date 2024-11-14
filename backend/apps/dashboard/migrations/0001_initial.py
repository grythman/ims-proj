# Generated by Django 5.1.3 on 2024-11-14 10:54

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Activity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('activity_type', models.CharField(choices=[('report_submission', 'Report Submission'), ('evaluation', 'Evaluation'), ('meeting', 'Meeting'), ('task_completion', 'Task Completion')], max_length=50)),
                ('description', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name_plural': 'Activities',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='DashboardMetric',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(choices=[('student_count', 'Student Count'), ('active_internships', 'Active Internships'), ('completion_rate', 'Completion Rate'), ('mentor_count', 'Mentor Count')], max_length=50)),
                ('value', models.IntegerField()),
                ('date', models.DateField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='DashboardStat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_internships', models.IntegerField(default=0)),
                ('active_internships', models.IntegerField(default=0)),
                ('completed_internships', models.IntegerField(default=0)),
                ('total_students', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]