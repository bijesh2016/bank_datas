import re
from bs4 import BeautifulSoup
import json

def extract_coordinates(html_file):
    
    with open(html_file, 'r', encoding='utf-8') as file:
        html_content = file.read()
    
    soup = BeautifulSoup(html_content, 'html.parser')
    
    branches = []
    
    rows = soup.select('table#branchlist tbody tr')
    
    for row in rows:
        
        cols = row.find_all('td')
        if len(cols) < 7: 
            continue
            
        branch_data = {
            's_no': cols[0].get_text(strip=True),
            'branch_name': cols[1].get_text(strip=True),
            'manager': cols[2].get_text(' ', strip=True).replace('\n', ' ').strip(),
            'province': cols[3].get_text(strip=True),
            'district': cols[4].get_text(strip=True),
            'address': cols[5].get_text(' ', strip=True).replace('\n', ' ').strip(),
            'coordinates': None
        }
        
        map_link = cols[6].find('a')
        if map_link and 'href' in map_link.attrs:
            url = map_link['href']
            match = re.search(r'[?&]q=([-+]?[0-9]*\.?[0-9]+),([-+]?[0-9]*\.?[0-9]+)', url)
            if match:
                branch_data['coordinates'] = {
                    'latitude': float(match.group(1)),
                    'longitude': float(match.group(2))
                }
            
        branches.append(branch_data)
    
    return branches

def main():
    html_file = 'demo1.html'
    output_file = 'nepalbank_coordinates.json'
    
    branches = extract_coordinates(html_file)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(branches, f, indent=2, ensure_ascii=False)
    
    print(f"Successfully extracted data for {len(branches)} branches to {output_file}")
    
    if branches:
        print("\nSample data (first 3 branches):")
        for branch in branches[:238]:
            print(f"\nBranch: {branch['branch_name']}")
            print(f"Location: {branch['district']}, {branch['province']}")
            if branch['coordinates']:
                print(f"Coordinates: {branch['coordinates']['latitude']}, {branch['coordinates']['longitude']}")
            else:
                print("No coordinates found")

if __name__ == "__main__":
    main()
