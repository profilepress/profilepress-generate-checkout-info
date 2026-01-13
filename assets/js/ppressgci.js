function ppress_fill_billing_fields(results) {
    if (!results || !results.location) return;

    const address = `${results.location.street.number} ${results.location.street.name}`;
    const $ = jQuery;

    $('[id$="_ppress_billing_address"]').val(address);
    $('[id$="_ppress_billing_city"]').val(results.location.city);
    $('[id$="_ppress_billing_country"]').val(results.nat).trigger('change');
    $('[id$="_ppress_billing_postcode"]').val(results.location.postcode);
    $('[id$="_ppress_billing_phone"]').val(results.phone);

    // Allow DOM to update country-dependent fields (like state)
    setTimeout(() => {
        const $stateField = $('[id$="_ppress_billing_state"]');
        const stateText = results.location.state || '';

        const matchedValue = $stateField.find('option').filter(function () {
            return $(this).text().trim().toLowerCase() === stateText.trim().toLowerCase();
        }).val();

        $stateField.val(matchedValue || stateText).trigger('change');
    }, 300);
}

function generate_checkout_info() {
    jQuery.ajax({
        url: 'https://randomuser.me/api/?nat=us',
        dataType: 'json',
        success: function (data) {
            const results = data?.results?.[0];
            if (!results) return;

            var $ = jQuery;
            const username = `${results.name.first}.${results.name.last}`;
            const baseEmail = $('#ppressgci-base-email').val() || (typeof ppressgci_vars !== 'undefined' ? ppressgci_vars.base_email : 'user@example.com');
            const atIndex = baseEmail.indexOf('@');
            const userEmail = `${baseEmail.substring(0, atIndex)}+${username}${baseEmail.substring(atIndex)}`;
            const website = `${results.name.first.toLowerCase()}.${results.name.last.toLowerCase()}.com`;
            const bio = 'Passionate professional with a proven track record of success in delivering high-impact solutions. Skilled in communication, teamwork, and continuous learning.';

            // Fill checkout form fields (existing functionality)
            $('#ppmb_username').val(username);
            $('#ppmb_password, #ppmb_password2').val(userEmail);
            $('#ppmb_email, #ppmb_email2').val(userEmail);
            $('#ppmb_first_name').val(results.name.first);
            $('#ppmb_last_name').val(results.name.last);
            $('#ppmb_website').val(website);
            $('#ppmb_bio').val(bio);

            // ProfilePress registration forms use different field naming patterns
            fillRegistrationFields($, results, username, userEmail, website, bio);

            // Wait for checkout form to fully render (especially for gateways)
            setTimeout(() => {
                ppress_fill_billing_fields(results);
            }, 200);
        },
        error: function (xhr, status, error) {
            // Gracefully handle API errors
            console.error('ppressgci: failed to fetch sample user', status, error);
            alert('Could not fetch sample user info. Please try again.');
        }
    });
}

function fillRegistrationFields($, results, username, userEmail, website, bio) {
    // Common registration field patterns in ProfilePress
    const fieldMappings = [
        // Username fields
        { selectors: ['input[name="reg_username"]', 'input[name="username"]', '#reg_username', '#username'], value: username },
        
        // Email fields
        { selectors: ['input[name="reg_email"]', 'input[name="email"]', '#reg_email', '#email'], value: userEmail },
        
        // Password fields
        { selectors: ['input[name="reg_password"]', 'input[name="password"]', '#reg_password', '#password'], value: username },
        { selectors: ['input[name="reg_password2"]', 'input[name="confirm_password"]', '#reg_password2', '#confirm_password'], value: username },
        
        // Name fields
        { selectors: ['input[name="reg_first_name"]', 'input[name="first_name"]', '#reg_first_name', '#first_name'], value: results.name.first },
        { selectors: ['input[name="reg_last_name"]', 'input[name="last_name"]', '#reg_last_name', '#last_name'], value: results.name.last },
        
        // Website field
        { selectors: ['input[name="reg_website"]', 'input[name="website"]', '#reg_website', '#website'], value: website },
        
        // Bio/Description fields
        { selectors: ['textarea[name="reg_bio"]', 'textarea[name="bio"]', 'textarea[name="description"]', '#reg_bio', '#bio', '#description'], value: bio },
        
        // Nickname field
        { selectors: ['input[name="reg_nickname"]', 'input[name="nickname"]', '#reg_nickname', '#nickname'], value: username },
        
        // Display name field
        { selectors: ['input[name="reg_display_name"]', 'input[name="display_name"]', '#reg_display_name', '#display_name'], value: `${results.name.first} ${results.name.last}` },
        
        // ProfilePress billing address fields (without prefix)
        { selectors: ['input[name="ppress_billing_first_name"]', '#ppress_billing_first_name'], value: results.name.first },
        { selectors: ['input[name="ppress_billing_last_name"]', '#ppress_billing_last_name'], value: results.name.last },
        { selectors: ['input[name="ppress_billing_company"]', '#ppress_billing_company'], value: results.company?.name || 'Sample Company' },
        { selectors: ['input[name="ppress_billing_address"]', '#ppress_billing_address'], value: `${results.location.street.number} ${results.location.street.name}` },
        { selectors: ['input[name="ppress_billing_address_2"]', '#ppress_billing_address_2'], value: 'Apt 123' },
        { selectors: ['input[name="ppress_billing_city"]', '#ppress_billing_city'], value: results.location.city },
        { selectors: ['input[name="ppress_billing_postcode"]', '#ppress_billing_postcode'], value: results.location.postcode },
        { selectors: ['input[name="ppress_billing_country"]', '#ppress_billing_country'], value: results.location.country },
        { selectors: ['input[name="ppress_billing_state"]', '#ppress_billing_state'], value: results.location.state },
        { selectors: ['input[name="ppress_billing_phone"]', '#ppress_billing_phone'], value: results.phone },
        
        // ProfilePress shipping address fields (without prefix)
        { selectors: ['input[name="ppress_shipping_first_name"]', '#ppress_shipping_first_name'], value: results.name.first },
        { selectors: ['input[name="ppress_shipping_last_name"]', '#ppress_shipping_last_name'], value: results.name.last },
        { selectors: ['input[name="ppress_shipping_company"]', '#ppress_shipping_company'], value: results.company?.name || 'Sample Company' },
        { selectors: ['input[name="ppress_shipping_address"]', '#ppress_shipping_address'], value: `${results.location.street.number} ${results.location.street.name}` },
        { selectors: ['input[name="ppress_shipping_address_2"]', '#ppress_shipping_address_2'], value: 'Apt 123' },
        { selectors: ['input[name="ppress_shipping_city"]', '#ppress_shipping_city'], value: results.location.city },
        { selectors: ['input[name="ppress_shipping_postcode"]', '#ppress_shipping_postcode'], value: results.location.postcode },
        { selectors: ['input[name="ppress_shipping_country"]', '#ppress_shipping_country'], value: results.location.country },
        { selectors: ['input[name="ppress_shipping_state"]', '#ppress_shipping_state'], value: results.location.state }
    ];

    // Fill fields based on mappings
    fieldMappings.forEach(mapping => {
        mapping.selectors.forEach(selector => {
            const $field = $(selector);
            if ($field.length > 0 && !$field.val()) {
                $field.val(mapping.value).trigger('change');
            }
        });
    });
}

(function($) {
    $(document).ready(function() {
        $('#ppressgci-generate').click(generate_checkout_info);
    });
})(jQuery);
