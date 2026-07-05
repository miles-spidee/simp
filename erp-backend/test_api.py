import requests

def main():
    try:
        response = requests.get('http://localhost:8000/api/v1/opportunity/')
        data = response.json()
        print("Opportunities count:", len(data))
        for opp in data:
            if opp.get('title') == 'pay pannunga':
                print(opp)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
