#!/usr/bin/env python3
"""Fix NaN values in JSON file by replacing with null"""

import json
import re
import sys

def fix_json_file(input_path, output_path):
    """Replace NaN with null in JSON file"""
    print(f"Reading {input_path}...")
    
    # Read the file as text
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print(f"Original size: {len(content)} bytes")
    
    # Replace NaN with null (JSON standard)
    # Match NaN that's not part of a word (e.g., not "NaNcy")
    content = re.sub(r'\bNaN\b', 'null', content)
    
    print(f"After replacement size: {len(content)} bytes")
    
    # Verify it's valid JSON
    print("Validating JSON...")
    try:
        data = json.loads(content)
        print(f"✓ Valid JSON with {len(data)} records")
        
        # Write the cleaned data
        print(f"Writing to {output_path}...")
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False)
        
        print("✓ Done!")
        return True
        
    except json.JSONDecodeError as e:
        print(f"✗ JSON validation failed: {e}")
        return False

if __name__ == '__main__':
    input_file = '/home/bakasur/Desktop/Open IIT/dashboard-react/public/netflix_data.json'
    output_file = '/home/bakasur/Desktop/Open IIT/dashboard-react/public/netflix_data_clean.json'
    
    if fix_json_file(input_file, output_file):
        print("\nBacking up original and replacing...")
        import shutil
        shutil.move(input_file, input_file + '.bak')
        shutil.move(output_file, input_file)
        print("✓ Original backed up to netflix_data.json.bak")
        print("✓ Clean file is now netflix_data.json")
