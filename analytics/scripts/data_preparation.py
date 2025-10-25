import random 
import json 
import os 
import pandas as pd 
from datetime import datetime
import numpy as np

curridr = os.getcwd()
base_dir = os.path.dirname(__file__)
analytic_path = os.path.dirname(base_dir)

path_file = os.path.join(analytic_path,"data")


file_names = ['books','reading_progress','user_interactions']


dict_fullpath = {}

for file in file_names:
    dict_fullpath[f"{file}"] = {}
    full_path_raw = path_file+f'/raw/{file}.json'
    full_path_processed = path_file+f'/processed/{file}.csv'
    dict_fullpath[f"{file}"]["file_name"] = file
    dict_fullpath[f"{file}"]["full_path_raw"] = full_path_raw
    dict_fullpath[f"{file}"]["full_path_processed"] = full_path_processed


with open(f"{dict_fullpath['books']['full_path_raw']}") as f:
    data = json.load(f)
    df = pd.json_normalize(data[f"books"])
    df['id'] = df['id'].astype(int)
    df['rating'] = df['rating'].astype(float)
df.to_csv(f"{dict_fullpath['books']['full_path_processed']}",encoding='utf-8-sig',index=False)


with open(f"{dict_fullpath['user_interactions']['full_path_raw']}") as f:
    data = json.load(f)
    df = pd.json_normalize(data[f"user_interactions"])
    df['id'] = df['id'].astype(int)
    df['timestamp'] = pd.to_datetime(df["timestamp"])

df.to_csv(f"{dict_fullpath['user_interactions']['full_path_processed']}",encoding="utf-8",index=False)

#reading_progress
with open(f"{dict_fullpath['reading_progress']['full_path_raw']}") as f:
    data = json.load(f)
    df = pd.json_normalize(data[f"reading_progress"])
    df['start_read'] = pd.to_datetime(df["start_read"])
    df['end_read'] = pd.to_datetime(df["end_read"])
    df['completion_rate'] = (df['pages_read'] / df['total_pages']).round(2)
    df['checking_pages'] = df['completion_rate']>1 

mean_pages = df["pages_read"].mean()

df["pages_read"] = np.where(df["completion_rate"] > 1, mean_pages, df["pages_read"])

df_clean = df[['user_id', 'book_id','pages_read','total_pages','interaction_id','start_read','end_read','completion_rate']]
df_clean.to_csv(f"{dict_fullpath['reading_progress']['full_path_processed']}",encoding="utf-8",index=False)

