# ProfilePress Generate Checkout Info

This plugin adds a utility button to ProfilePress checkout pages and registration forms that automatically fills in test user information using data from [randomuser.me](https://randomuser.me/). It is intended to speed up and simplify the process of manually testing checkout flows and user registration.

## Features

- Adds a "Generate User Info" button to ProfilePress checkout forms and registration forms
- Automatically fills in:
  - Username
  - Email
  - Password and confirmation
  - First and last name
  - Website
  - Bio/description
  - Address (for checkout forms)
  - Display name and nickname (for registration forms)
- Fetches realistic data from randomuser.me (e.g., `Terry.Wright` instead of `test123`)
- Works with all ProfilePress registration form themes and templates
- Saves time during development and QA

## Requirements

- [ProfilePress](https://www.profilepress.com/) must be installed and activated
- WordPress 5.0+

## Installation

1. Clone or download this repository.
2. Upload the plugin to your WordPress installation:
   - Upload via **Plugins > Add New > Upload Plugin** in the WordPress dashboard, or
   - Upload the extracted folder to `/wp-content/plugins/` via FTP or CLI
3. Activate the plugin through the WordPress admin under **Plugins**

## Usage

Once the plugin is active:

### For Checkout Forms:
1. Navigate to the ProfilePress checkout page.
2. You will see a **"Generate User Info"** button beside the base email field.
3. Click the button to populate the username, email, password, and address fields with randomized test data.
4. Continue the checkout process as usual.

### For Registration Forms:
1. Navigate to any page with a ProfilePress registration form (using `[profilepress-registration]` shortcode).
2. You will see a **"Generate User Info"** button within the registration form.
3. Click the button to populate all available registration fields with randomized test data.
4. Complete the registration process as usual.

## Notes

- This plugin is intended for development and staging environments. It should not be used on production sites.
- No data is stored or tracked by this plugin; all user data is fetched on demand from the [randomuser.me](https://randomuser.me/) API.

## Contributing

Pull requests are welcome. If you encounter a bug or have a feature suggestion, feel free to open an issue.
