import json

# Load both JSON files
with open('nepalbank_coordinates.json', 'r') as f1:
    data1 = json.load(f1)
with open('nepalbank.json', 'r') as f2:
    data2 = json.load(f2)

# Create a dictionary for quick lookup from nepalbank.json
data2_dict = {item['S.No.']: item for item in data2}

# Merge data
merged_data = []
for item1 in data1:
    s_no = item1['s_no']
    item2 = data2_dict.get(s_no)
    if item2:
        merged_item = {
            's_no': item1['s_no'],
            'branch_name': item1['branch_name'],
            'manager': item1['manager'],
            'province': item1['province'],
            'district': item1['district'],
            'address': item1['address'],
            'coordinates': item1['coordinates'],
            'Map': item2['Map']
        }
        merged_data.append(merged_item)

# Save merged data
with open('merged_nepalbank.json', 'w') as f:
    json.dump(merged_data, f, indent=2)