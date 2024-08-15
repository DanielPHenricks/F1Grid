import csv

from django.core.management import BaseCommand
from django.core.management.base import CommandParser

from backend.models import Constructor

# Run this by running:
# python .\manage.py import_constructors --path .\data\constructors.csv
class Command(BaseCommand):
    help = "Load all constructors into the local database"

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
               Constructor.objects.create(
                   constructor_id=row[0],
                   constructorRef=row[1],
                   constructor_name=row[2],
               )