import re

try:
    with open(r'c:\Development\code-ride\rating_debug_4.txt', 'rb') as f:
        content = f.read()
        # Try decoding as utf-16-le
        try:
            text = content.decode('utf-16-le')
        except:
            text = content.decode('utf-8', errors='ignore')
            
        for line in text.splitlines():
            if 'UserGuard: JWT Payload:' in line:
                print(f"Full Line: {line}")
                match = re.search(r'"role":"([^"]*)"', line)
                if match:
                    print(f"Extracted Role: {match.group(1)}")
            if 'UserGuard: TEMPORARILY ALLOWING ALL' in line:
                print(f"Bypassed: {line}")
except Exception as e:
    print(f"Error: {e}")
