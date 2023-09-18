FROM python:3.10 AS base

WORKDIR /backend
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

FROM base AS development
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]

FROM base AS production
RUN pip install gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "backend_django.wsgi:application"]