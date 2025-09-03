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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
                        $table->unsignedBigInteger('basket_id');
                        $table->decimal('total', 10, 2);
                        $table->string('status')->default('pending'); // pendiente, completado, fallido

                        // Datos de facturación
                        $table->string('name');
                        $table->string('email');
                        $table->string('direction');
                        $table->string('city');
                        $table->string('zip');
                        $table->string('country');

                        $table->timestamps();

                        $table->foreign('basket_id')->references('id')->on('baskets')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
