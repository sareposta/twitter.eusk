<template>
	<div>
		<main class="content flex-1 overflow-x-hidden">
			<i-modal variant="danger" v-model="visibleDeleteModal">
				<template slot="header">¿Estas seguro?</template>
				<p style="font-weight: bold;">Vas a eliminar la colección y esta acción no se puede revertir.</p>
				<template slot="footer">
					<i-button :loading="loading" @click="confirm" variant="danger">ELIMINAR</i-button>
				</template>
			</i-modal>

			<div class="container mx-auto px-6 py-8">
				<h3 class="text-gray-700 text-3xl font-semibold">Colecciones</h3>

				<content-placeholders :rounded="true" v-if="rows.length < 1 && !loaded">
					<content-placeholders-heading :img="true" />
					<content-placeholders-text :lines="3" />
				</content-placeholders>

				<i-datatable
					:pagination="pagination"
					v-if="rows.length > 0 || loaded"
					:striped="true"
					:columns="columns"
					:i18n="i18n"
					:rows="rows"
				>
					<template v-slot:row="{ row, index }">
						<td align="right">{{ index + 1 }}</td>
						<td>
							<img class="h-10 w-10 rounded-full" :src="user.profile_image_url" alt="" />
							<b>{{ row.name }}</b>
						</td>

						<td>
							<i-button @click="goToSee(row)" size="sm" class="" variant="success">VER</i-button>
							<i-button @click="goTo(row)" size="sm" class="ml-2 mr-2" variant="info">ACCEDER</i-button>
							<i-button :loading="loading" @click="deleteRow(row)" size="sm" variant="dark"
								>ELIMINAR</i-button
							>
						</td>
					</template>
				</i-datatable>
			</div>
		</main>
	</div>
</template>

<script>
import axios from 'axios';
export default {
	mounted() {
		this.getData();
	},
	auth: true,
	methods: {
		async confirm() {
			var url = this.row.collection_url.split('/');
			var id = url[url.length - 1];
			var response = null;
			this.loading = true;
			try {
				response = await axios.post('/api/collections/remove', {
					id,
				});
			} catch (error) {}
			this.loading = false;
			this.row = null;
			this.visibleDeleteModal = false;
			document.location.reload()
		},
		goTo(row) {
			window.open(row.collection_url, '_blank');
		},
		goToSee(row) {

			var url = row.collection_url.split('/');
			var id = url[url.length - 1];

			this.$router.push('show?id=' + id)
		},
		deleteRow(row) {
			this.row = row;
			this.visibleDeleteModal = true;
		},
		async getData() {
			try {
				var data = await axios.get('/api/collections/list');

				this.loaded = true;

				if (data.data.objects) {
					var rows = data.data.objects;
					if (rows.timelines) {
						this.rows = Object.values(rows.timelines);
						var user = Object.values(data.data.objects.users);
						this.user = user[0];
					}
				}
			} catch (error) {
				console.log(error);
			}
		},
	},
	data() {
		return {
			loading: false,
			loaded: false,
			row: null,
			visibleDeleteModal: false,
			i18n: {
				pagination: {
					rowsPerPage: 'Mostrando {rowsPerPage} colecciones',
					rowsRange: 'Mostrando {rowsTo} de {rowsCount} colecciones',
				},
				filtering: {
					inputPlaceholder: 'Buscar',
					noResultsFound: 'No se encuentran registros',
				},
			},
			pagination: {
				limit: { xs: 3, sm: 5 },
				size: 'md',
				variant: 'light',
				rowsFrom: 0,
				rowsPerPage: 5,
				rowsPerPageOptions: [5, 10, 25, 50, 100],
			},
			columns: [
				{ title: 'Nombre del escuchador', path: 'name' },
				{ title: 'Opciones', path: 'options' },
			],
			rows: [],
		};
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
button {
	font-weight: bold !important;
}
</style>
