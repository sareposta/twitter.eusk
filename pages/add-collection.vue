<template>
	<main class="flex-1">
		<div class="container mx-auto px-6 py-8">
			<h3 class="text-gray-700 text-3xl font-semibold">Agregar Colección</h3>

			<div class="mt-8">
				<h4 class="text-gray-600"></h4>

				<div class="mt-4">
					<div class="p-6 bg-white rounded-md shadow-md">
						<h2 class="text-lg text-gray-700 font-semibold">Nombre de la colección*</h2>

						<div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
							<div>
								<i-input size="lg" v-model="name" placeholder="Ingrese nombre para la colección" />
							</div>
						</div>

						<div class="flex justify-start mt-4 ml-2">
							<i-button size="lg" :loading="loading" @click="add" variant="dark"
								>AGREGAR
								<template v-slot:loading>
									<i-loader size="auto" variant="dark" class="_margin-right-1-2" />
									Cargando
								</template>
							</i-button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<i-modal variant="primary" v-model="visibleModal">
			<template slot="header">Colección creada de forma exitosa!</template>
			Felicidades, ya puedes agregar tweets a la colección.
			<template slot="footer">
				<i-button @click="goToReport" variant="primary">Ir a la colección en twitter</i-button>
				<i-button @click="visibleModal = false" variant="danger">Ok</i-button>
			</template>
		</i-modal>
	</main>
</template>

<script>
import axios from 'axios';
export default {
	auth: true,
	data() {
		return {
			loading: false,
			visibleModal: false,
			name: '',
			reportUrl: '',
		};
	},
	methods: {
		goToReport() {
			window.open(this.reportUrl, '_blank');
		},
		async add() {
			if (!this.name || this.name == '') {
				alert('El nombre no existe.');
				return;
			}

			this.loading = true;

			try {
				var response = await axios.post('/api/collections/create', {
					name: this.name,
				});
				this.name = '';
				this.loading = false;
				this.reportUrl =
					response.data.collection.objects.timelines[
						response.data.collection.response.timeline_id
					].collection_url;

				this.visibleModal = true;
			} catch (error) {
				console.log('error', error);
				this.loading = false;
			}
		},
	},
};
</script>

<style>
.form-input {
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
	background-color: transparent !important;
	border: 0px;
	padding: 10px;
}
</style>
