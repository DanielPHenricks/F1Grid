import csv

from django.core.management import BaseCommand
from django.core.management.base import CommandParser

from backend.models import Driver

# Run this by running:
# python .\manage.py import_drivers --path .\data\drivers.csv
class Command(BaseCommand):
    help = "Load all drivers (past or present) into the database"

    # Add flags to the command. For example: 
    # python manage.py import_drivers [argument] [argument_value]
    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument("--path", type=str)

    # The logic behind the command.
    def handle(self, *args, **kwargs):
       path = kwargs["path"]
       with open(path, "rt", encoding="utf8") as file:
           reader = csv.reader(file)
           next(reader) # Skip the CSV headers.
           for row in reader:
               Driver.objects.create(
                   driver_id=row[0],
                   forename=row[4],
                   surname=row[5],
                   nationality=row[7]
               )