<?php
/**
 * Plugin Name: ProfilePress Generate Checkout Info
 * Description: Adds a button to ProfilePress checkout and registration forms to generate test user information.
 * Version: 1.1.0
 * Author: Ibrahim Nasir
 * Author URI: https://www.ibrahim.ng/
 * Text Domain: profilepress-generate-checkout-info
 * Domain Path: /languages
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Load plugin textdomain for translations.
 */
function ppressgci_v2_load_textdomain() {
	load_plugin_textdomain('profilepress-generate-checkout-info', false, dirname(plugin_basename(__FILE__)) . '/languages');
}
add_action('plugins_loaded', 'ppressgci_v2_load_textdomain');

/**
 * Initialize plugin after WordPress is fully loaded
 */
function ppressgci_v2_init() {
	// Hook into ProfilePress actions
	add_action( 'ppress_checkout_before_account_info_fields', 'ppressgci_v2_create_button' );
	add_filter( 'ppress_registration_form_field_structure', 'ppressgci_v2_add_button_to_registration_form', 10, 2 );
	add_action( 'wp_enqueue_scripts', 'ppressgci_v2_enqueue_scripts' );
	add_action( 'wp_enqueue_scripts', 'ppressgci_v2_enqueue_styles' );
}
add_action( 'init', 'ppressgci_v2_init' );

/**
 * Check if we're on a ProfilePress registration form page
 */
function ppressgci_v2_is_registration_form() {
	global $post;
	
	if ( ! $post ) {
		return false;
	}
	
	// Check if the current page/post contains a ProfilePress registration shortcode
	if ( function_exists( 'has_shortcode' ) ) {
		$content = $post->post_content;
		if ( has_shortcode( $content, 'profilepress-registration' ) || has_shortcode( $content, 'pp-registration-form' ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Check if we should load scripts (checkout or registration forms)
 */
function ppressgci_v2_should_load_scripts() {
	// Load on checkout pages
	if ( function_exists( 'ppress_is_checkout' ) && ppress_is_checkout() ) {
		return true;
	}
	
	// Load on registration form pages
	if ( ppressgci_v2_is_registration_form() ) {
		return true;
	}
	
	return false;
}

/**
 * Enqueue scripts on the frontend.
 */
function ppressgci_v2_enqueue_scripts() {

	if ( ! ppressgci_v2_should_load_scripts() ) {
		return;
	}

	$base_email = get_option('admin_email', 'user@example.com');

	$script_path = plugin_dir_path( __FILE__ ) . 'assets/js/ppressgci.js';
	$script_ver  = file_exists( $script_path ) ? filemtime( $script_path ) : '1.1.0';
	wp_register_script( 'ppressgci-v2-script', plugin_dir_url( __FILE__ ) . 'assets/js/ppressgci.js', array( 'jquery' ), $script_ver, true );
	wp_enqueue_script( 'ppressgci-v2-script' );
	wp_localize_script( 'ppressgci-v2-script', 'ppressgci_vars', array(
		'base_email' => $base_email
	) );

}

function ppressgci_v2_enqueue_styles() {

	if ( ! ppressgci_v2_should_load_scripts() ) {
		return;
	}

	$style_path = plugin_dir_path( __FILE__ ) . 'assets/css/ppressgci.css';
	$style_ver  = file_exists( $style_path ) ? filemtime( $style_path ) : '1.1.0';
	wp_enqueue_style('ppressgci-v2-style', plugin_dir_url(__FILE__) . 'assets/css/ppressgci.css', array(), $style_ver);
}


function ppressgci_v2_create_button() {
    ?>

    <div class="ppressgci-row">
        <label for="ppressgci-base-email" class="ppressgci-label"><?php echo esc_html__( 'Base email for generating new user info:', 'profilepress-generate-checkout-info' ); ?></label>
        <div class="ppressgci-controls">
            <input type="text" id="ppressgci-base-email" value="<?php echo esc_attr( get_option('admin_email') ); ?>">
            <button id="ppressgci-generate" class="ppressgci-btn" type="button"><?php echo esc_html__( 'Generate User Info', 'profilepress-generate-checkout-info' ); ?></button>
        </div>
    </div>
    
    <?php
}

// Add button to registration forms using the form field structure filter
function ppressgci_v2_add_button_to_registration_form( $form_structure, $form_id ) {
	ob_start();
	ppressgci_v2_create_button();
	$button_html = ob_get_clean();
	
	// Add the button at the beginning of the form structure
	return $button_html . $form_structure;
}
