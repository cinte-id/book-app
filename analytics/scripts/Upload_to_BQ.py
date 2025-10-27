from google.cloud import bigquery
import pandas as pd
import os 
import sys 
# 
base_dir = os.path.dirname(__file__)
analytic_path = os.path.dirname(base_dir)

path_file = os.path.join(analytic_path,"cred")


os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = path_file+"/book-app-476105-d529180e65ed.json"

client = bigquery.Client()

csv_file_path = sys.argv[1]
table_id = sys.argv[2]

project_id = "book-app-476105"
dataset_id = "dataset_book"

# table_id = "exupload"
# csv_file_path = "./bucket/project_austin_customer.csv"

job_config = bigquery.LoadJobConfig(
    source_format=bigquery.SourceFormat.CSV,
    skip_leading_rows=1,  # Skip header row
    autodetect=True,      # BigQuery attempts to infer schema
    write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE, # Overwrite table if it exists
    # Alternatively, use WRITE_APPEND to append data:
    # write_disposition=bigquery.WriteDisposition.WRITE_APPEND,
    # Or, specify a custom schema if autodetect is not sufficient:
    # schema=[
    #     bigquery.SchemaField("column1", "STRING"),
    #     bigquery.SchemaField("column2", "INTEGER"),
    #     # ... more fields
    # ]
)

with open(csv_file_path, "rb") as source_file:
    job = client.load_table_from_file(
        source_file,
        f"{project_id}.{dataset_id}.{table_id}",
        job_config=job_config,
    )

job.result()  # Waits for the job to complete
print(f"Loaded {job.output_rows} rows into {dataset_id}.{table_id}")

