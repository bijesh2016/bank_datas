import json
import re
from bs4 import BeautifulSoup
from urllib.parse import urlparse, parse_qs

def extract_coordinates(html_file):
    with open(html_file, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')
    
    branches = []
    
    # Find all table rows
    rows = soup.select('table.table-bordered tbody tr')
    
    for row in rows:
        cells = row.find_all('td')
        if len(cells) < 9:  # Skip rows that don't have enough cells
            continue
            
        # Extract branch information
        branch = {
            'branch_name': cells[0].get_text(strip=True),
            'manager': cells[1].get_text(strip=True),
            'emails': {
                'branch_email': cells[2].get_text(strip=True),
                'bm_email': cells[3].get_text(strip=True)
            },
            'phone': cells[4].get_text(strip=True),
            'fax': cells[5].get_text(strip=True),
            'address': '',
            'province': cells[7].get_text(strip=True),
            'district': cells[8].get_text(strip=True),
            'coordinates': None
        }
        
        # Extract address text (excluding the map link)
        address_cell = cells[6]
        # Get all text content, but skip the map link
        address_parts = []
        for content in address_cell.contents:
            if content.name == 'a' and 'maps.google.com' in str(content.get('href', '')):
                # This is the map link, extract coordinates
                map_url = content.get('href', '')
                coords = extract_coords_from_url(map_url)
                if coords:
                    branch['coordinates'] = coords
            elif isinstance(content, str):
                address_parts.append(content.strip())
        
        branch['address'] = ' '.join(part for part in address_parts if part)
        branches.append(branch)
    
    return branches

def extract_coords_from_url(url):
    """Extract coordinates from Google Maps URL"""
    try:
        # Handle direct coordinate format: ?q=lat,lng
        if '?q=' in url:
            coords_str = url.split('?q=')[1].split('&')[0]
            if ',' in coords_str:
                lat, lng = coords_str.split(',')
                try:
                    return {
                        'latitude': float(lat),
                        'longitude': float(lng)
                    }
                except (ValueError, TypeError):
                    pass
        
        # Handle other URL formats if needed
        # ...
        
    except Exception as e:
        print(f"Error parsing URL {url}: {e}")
    
    return None

def save_to_json(data, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def main():
    input_file = 'everestdemo.html'
    output_file = 'everest_with_coordinates.json'
    
    print(f"Extracting coordinates from {input_file}...")
    branches = extract_coordinates(input_file)
    
    # Count branches with coordinates
    with_coords = sum(1 for b in branches if b['coordinates'])
    print(f"Processed {len(branches)} branches, {with_coords} with coordinates")
    
    print(f"Saving to {output_file}...")
    save_to_json(branches, output_file)
    print("Done!")

if __name__ == "__main__":
    main()
