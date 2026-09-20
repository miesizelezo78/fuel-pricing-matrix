<?php
if (!defined('ABSPATH') && !defined('VULCANUS_BULK_STANDALONE')) {
    exit;
}
$order = isset($_GET['order']) ? htmlspecialchars($_GET['order'], ENT_QUOTES, 'UTF-8') : '';
ob_start();
?>
<div class="card" style="max-width:36rem;margin:2rem auto">
  <p class="eyebrow">Objednávka</p>
  <h1><?php echo $order ?: 'Objednávka odoslaná'; ?></h1>
  <p>Záväzná paletová objednávka. Solo Woo košík sa nemení.</p>
  <p><a class="btn btn-primary" href="<?php echo vulcanus_e(vulcanus_url('objednavka-paleta')); ?>">Späť na Paletu</a>
     <a class="btn btn-outline" href="<?php echo vulcanus_e(vulcanus_url('paliva')); ?>">Palivá</a></p>
</div>
<?php
return ob_get_clean();
