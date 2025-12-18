
try:
    with open(r'c:\Development\code-ride\rating_debug_4.txt', 'rb') as f:
        content = f.read()
        try:
            text = content.decode('utf-16-le')
        except:
            text = content.decode('utf-8', errors='ignore')
            
        lines = text.splitlines()
        for i, line in enumerate(lines):
            if '403' in line:
                print(f"Line {i}: {line}")
            if 'TypeError' in line:
                print(f"Line {i}: {line}")
except Exception as e:
    print(f"Error: {e}")
