<?php
if (!defined('ABSPATH') && !defined('VULCANUS_BULK_STANDALONE')) {
    exit;
}
$channel = isset($GLOBALS['vulcanus_karty_channel']) ? $GLOBALS['vulcanus_karty_channel'] : 'bulk';
$img = vulcanus_fuel_image_url();
$fuels = array('uhlie', 'antracit', 'koks');
ob_start();
?>
<div class="vd-grid vulcanus-vd-grid" data-vulcanus-karty>
<?php
foreach ($fuels as $fuel_id) {
    if ($channel === 'all') {
        vulcanus_echo_fuel_card($fuel_id, 'solo', $img);
    }
    vulcanus_echo_fuel_card($fuel_id, 'bulk', $img);
}
?>
</div>
<?php
return ob_get_clean();
