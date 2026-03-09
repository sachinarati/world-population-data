import requests
import json
import os

def update_data():
    # Only fetching name and population to keep the file small and fast
    url = "https://restcountries.com/v3.1/all?fields=name,population,flags"
    
    try:
        print("❄️  Fetching data from API...")
        response = requests.get(url)
        response.raise_for_status()
        countries = response.json()

        # Define the path to your React src folder
        # This assumes your structure is: 
        # /world-data-app
        #   /server (where this file is)
        #   /client/src (where data.json will go)
        target_path = os.path.join("..", "client", "src", "data.json")

        with open(target_path, "w", encoding="utf-8") as f:
            json.dump(countries, f, ensure_ascii=False, indent=4)
        
        print(f"✅ Success! Static data saved to: {target_path}")

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    update_data()