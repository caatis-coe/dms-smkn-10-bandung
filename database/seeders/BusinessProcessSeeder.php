<?php

namespace Database\Seeders;

use App\Models\BusinessProcess;
use App\Models\BusinessProcessNode;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class BusinessProcessSeeder extends Seeder
{
    public function run(): void
    {
        Storage::disk('public')->makeDirectory('business-processes');

        $nodes = BusinessProcessNode::with('children')->get();

        foreach ($nodes as $node) {

            // Attach BP to children if exist, else to node itself
            $targets = $node->children->isNotEmpty()
                ? $node->children
                : collect([$node]);

            foreach ($targets as $targetNode) {
                for ($i = 1; $i <= rand(2, 4); $i++) {

                    $fileName = sprintf(
                        'bp_%s_%d.png',
                        str_replace('.', '_', $targetNode->code),
                        $i
                    );

                    $filePath = "business-processes/{$fileName}";

                    // Generate dummy image
                    $this->generateDummyImage(
                        $filePath,
                        "BP {$targetNode->code}.{$i}"
                    );

                    BusinessProcess::create([
                        'business_process_node_id' => $targetNode->id,
                        'name'                     => "BP {$targetNode->code}.{$i}",
                        'file_path'                => $filePath,
                        'order'                    => $i,
                    ]);
                }
            }
        }
    }

    /**
     * Generate a dummy PNG image with text
     */
    private function generateDummyImage(string $path, string $label): void
    {
        $width = 600;
        $height = 400;

        $image = imagecreatetruecolor($width, $height);

        $bg = imagecolorallocate($image, 240, 240, 240);
        $textColor = imagecolorallocate($image, 50, 50, 50);

        imagefilledrectangle($image, 0, 0, $width, $height, $bg);

        imagestring(
            $image,
            5,
            20,
            ($height / 2) - 10,
            $label,
            $textColor
        );

        // Capture output
        ob_start();
        imagepng($image);
        $imageData = ob_get_clean();

        imagedestroy($image);

        Storage::disk('public')->put($path, $imageData);
    }
}
