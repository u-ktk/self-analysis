import bleach

def sanitize_html(html):
    ALLOWED_TAGS = ['b', 'i', 'u', 'p', 'a', 'ul', 'ol', 'li', 'strong', 'em', 'br', 'span', 'h1', 'h2', 'h3']
    ALLOWED_ATTRIBUTES = {
        '*': ['style'],  
        'a': ['href', 'title'],  
    }
    ALLOWED_STYLES = ['background-color']
    return bleach.clean(html, tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRIBUTES, styles=ALLOWED_STYLES, strip=True)
