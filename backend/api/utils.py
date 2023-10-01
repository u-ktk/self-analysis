import bleach

def sanitize_html(html):
    ALLOWED_TAGS = ['b', 'i', 'u', 'p', 'a', 'ul', 'ol', 'li', 'strong', 'em', 'br']
    return bleach.clean(html, tags=ALLOWED_TAGS, strip=True)
