<?php
/**
 * Plugin Name:       Caritas Calculator
 * Description:       Калькулятор вартості догляду вдома на місяць. Вставте шорткод [caritas_calculator] на сторінку.
 * Version:           1.0.0
 * Requires at least: 6.5
 * Requires PHP:      7.4
 * Author:            Pavlo Hrebeniuk
 * Text Domain:       caritas-calculator
 */

defined( 'ABSPATH' ) || exit;

const CARITAS_CALC_HANDLE    = 'caritas-calculator';
const CARITAS_CALC_SHORTCODE = 'caritas_calculator';

/**
 * Registers the built assets (see `npm run build:wp`). The file modification time is used as the
 * version, so browsers and page caches pick up a new build without bumping the plugin version.
 */
function caritas_calc_register_assets() {
	$dir = plugin_dir_path( __FILE__ ) . 'build/';
	$url = plugin_dir_url( __FILE__ ) . 'build/';

	if ( ! file_exists( $dir . 'calculator.js' ) ) {
		return;
	}

	// The bundle is an ES module (it lazy-loads the PDF libraries with import()), so it goes through the
	// Script Modules API, which prints type="module" itself. A plain wp_register_script() with a
	// type="module" tag filter breaks under optimizers such as WP-Optimize: they re-emit the minified
	// file as a classic <script> and the browser throws "Cannot use import statement outside a module".
	wp_register_script_module( CARITAS_CALC_HANDLE, $url . 'calculator.js', array(), (string) filemtime( $dir . 'calculator.js' ) );

	if ( file_exists( $dir . 'calculator.css' ) ) {
		wp_register_style( CARITAS_CALC_HANDLE, $url . 'calculator.css', array(), (string) filemtime( $dir . 'calculator.css' ) );
	}

	// Enqueue in <head> when we can see the shortcode in the post, to avoid a flash of unstyled content.
	// Pages built elsewhere (widgets, page builders) fall back to enqueueing from the shortcode itself.
	$post = get_post();
	if ( is_singular() && $post && has_shortcode( $post->post_content, CARITAS_CALC_SHORTCODE ) ) {
		wp_enqueue_style( CARITAS_CALC_HANDLE );
		wp_enqueue_script_module( CARITAS_CALC_HANDLE );
	}
}
add_action( 'wp_enqueue_scripts', 'caritas_calc_register_assets' );

function caritas_calc_shortcode() {
	wp_enqueue_style( CARITAS_CALC_HANDLE );
	wp_enqueue_script_module( CARITAS_CALC_HANDLE );

	return '<div class="caritas-calculator-root">'
		. '<noscript>Для роботи калькулятора потрібно увімкнути JavaScript. Телефон для довідок: +38 067 801 88 96.</noscript>'
		. '</div>';
}
add_shortcode( CARITAS_CALC_SHORTCODE, 'caritas_calc_shortcode' );
