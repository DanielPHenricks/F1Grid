import csv

from django.core.management import BaseCommand
from django.core.management.base import CommandParser

from backend.models import Result

# Run this by running:
# python .\manage.py import_results --path .\data\results.csv
class Command(BaseCommand):
    help = "Load all results into the database"

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
               Result.objects.create(
                   result_id=row[0],
                   race_id=row[1],
                   driver_id=row[2],
                   constructor_id=row[3],
                   position_text=row[7]
               )