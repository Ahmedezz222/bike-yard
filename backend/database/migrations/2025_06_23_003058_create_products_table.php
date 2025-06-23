<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->json('images')->nullable();
            $table->string('category');
            $table->integer('stock')->default(0);
            $table->boolean('featured')->default(false);
            $table->string('sku')->unique()->nullable();
            $table->decimal('weight', 8, 2)->nullable();
            $table->json('dimensions')->nullable();
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->integer('year')->nullable();
            $table->enum('condition', ['new', 'used', 'refurbished'])->default('new');
            $table->string('warranty')->nullable();
            $table->text('shipping_info')->nullable();
            $table->timestamps();

            $table->index(['category', 'featured']);
            $table->index(['price', 'stock']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
