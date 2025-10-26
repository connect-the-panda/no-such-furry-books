# Deployment Guide for No Such Furry Books

This guide walks you through deploying your website to Netlify for free hosting.

## Prerequisites

- GitHub account (free)
- Netlify account (free - sign up at netlify.com)
- Git installed on your computer

## Step 1: Prepare the Repository

The repository has already been initialized. Now commit the initial files:

```bash
cd /c/Users/sanap/no-such-furry-books
git add .
git commit -m "Initial commit: No Such Furry Books website"
```

## Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `no-such-furry-books`
3. Description: "Website for No Such Furry Books - Independent children's book press"
4. Choose **Public** or **Private** (both work with Netlify)
5. Do NOT initialize with README (we already have files)
6. Click "Create repository"

## Step 3: Push to GitHub

After creating the repo, GitHub will show you commands. Use these:

```bash
cd /c/Users/sanap/no-such-furry-books
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/no-such-furry-books.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 4: Deploy to Netlify

### Option A: Netlify Dashboard (Easiest)

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub"
4. Authorize Netlify to access your GitHub
5. Select the `no-such-furry-books` repository
6. Configure build settings:
   - **Branch to deploy**: main
   - **Build command**: (leave empty)
   - **Publish directory**: (leave empty or enter `.`)
7. Click "Deploy site"

### Option B: Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Navigate to project
cd /c/Users/sanap/no-such-furry-books

# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy to production
netlify deploy --prod
```

## Step 5: Configure Custom Domain (Optional)

Once you get `nosuchfurrybooks.com`:

1. In Netlify dashboard, go to "Site settings" → "Domain management"
2. Click "Add custom domain"
3. Enter `nosuchfurrybooks.com`
4. Follow DNS configuration instructions
5. Netlify provides free SSL certificate automatically

### DNS Settings (when ready)

Add these records at your domain registrar:

**For apex domain (nosuchfurrybooks.com):**
```
Type: A
Name: @
Value: 75.2.60.5
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: YOUR-SITE-NAME.netlify.app
```

## Step 6: Set Up Email Newsletter (When Ready)

### MailerLite Integration (Recommended)

1. Sign up at https://www.mailerlite.com (free for 1,000 subscribers)
2. Create a new group for "No Such Furry Books Newsletter"
3. Go to Forms → Create embedded form
4. Copy the HTML form code
5. Replace the placeholder form in your HTML files:

```html
<!-- Replace the current newsletter form with MailerLite's code -->
<form action="https://assets.mailerlite.com/jsonp/XXXX/forms/submit/" method="post">
  <!-- MailerLite form fields -->
</form>
```

### Alternative: ConvertKit

1. Sign up at https://convertkit.com
2. Create a form
3. Get the embed code
4. Replace newsletter forms in HTML files

### Alternative: BookFunnel

1. Sign up at https://bookfunnel.com
2. Create a landing page for your newsletter
3. Link newsletter buttons to BookFunnel URL

## Step 7: Post-Deployment Checklist

After deployment:

- [ ] Visit your Netlify URL to test the site
- [ ] Check all pages load correctly (Home, About, Books)
- [ ] Test responsive design on mobile
- [ ] Verify smooth scrolling works
- [ ] Test newsletter form (will show placeholder until integrated)
- [ ] Set up Google Analytics or Simple Analytics (optional)
- [ ] Submit to Google Search Console
- [ ] Create sitemap.xml (can add later)

## Continuous Deployment

Once connected to GitHub, Netlify automatically deploys when you push changes:

```bash
# Make changes to files
# Then commit and push
git add .
git commit -m "Description of changes"
git push origin main
```

Netlify will automatically rebuild and deploy within 1-2 minutes.

## Monitoring

Check deployment status:
- Netlify Dashboard: https://app.netlify.com
- Build logs show any errors
- Deploy previews for branches (automatic)

## Common Issues

**Site not loading CSS/JS:**
- Check file paths are relative (they are in this setup)
- Clear browser cache

**Newsletter form not working:**
- Expected until you integrate actual service
- Follow Step 6 to connect

**404 errors:**
- Check netlify.toml redirect rules (already configured)

## Future Updates

When adding new books:
1. Add book cover images to `/images/` folder
2. Create individual book pages (e.g., `book-title.html`)
3. Update `books.html` with new entries
4. Commit and push to deploy

## Backup Strategy

Your site is backed up via:
- GitHub repository (version control)
- Netlify automatic snapshots
- Local files on your computer

Recommended: Keep local backup of images and important files.

## Cost

**Current setup: $0/month**

- Netlify free tier: Unlimited personal/commercial sites
- 100GB bandwidth/month (plenty for starting)
- SSL certificate included
- GitHub: Free for public repos

**Future costs only if:**
- Domain name: ~$12/year
- Email service: $0-20/month depending on subscribers
- Upgraded Netlify: Only if exceeding bandwidth (unlikely)

## Support Resources

- Netlify Docs: https://docs.netlify.com
- Netlify Community: https://answers.netlify.com
- GitHub Docs: https://docs.github.com

## Next Steps After Deployment

1. **Brand Assets**: Add logo, favicon, social media images
2. **Analytics**: Set up tracking to monitor traffic
3. **Email Integration**: Connect newsletter service
4. **Social Media**: Create accounts and add links
5. **Content**: Write blog posts for SEO
6. **Books**: Add first book when ready!

---

Questions? Check the README.md file for additional information.
