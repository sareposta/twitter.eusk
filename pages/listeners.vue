<template>
	<div>
		<main class="content flex-1 overflow-x-hidden">
			<i-modal variant="danger" v-model="visibleDeleteModal">
				<template slot="header">¿Estas seguro?</template>
				<p style="font-weight: bold;">Vas a eliminar el escuchador y esta acción no se puede revertir.</p>
				<template slot="footer">
					<i-button :loading="loading" @click="confirm" variant="danger">ELIMINAR</i-button>
				</template>
			</i-modal>

			<div class="container mx-auto px-6 py-8">
				<h3 class="text-gray-700 text-3xl font-semibold">Escuchadores</h3>

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
							<b>{{ row.name }}</b>
						</td>

						<td>
							<i-button @click="goTo(row)" size="sm" class="ml-5 mr-2" variant="info">ACCEDER</i-button>
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
			var id = this.row._id;
			var response = null;
			this.loading = true;

			try {
				response = await axios.post('/api/listener/remove', {
					id,
				});
			} catch (error) {
				console.log('error', error);
			}
			this.loading = false;

			this.row = null;
			this.visibleDeleteModal = false;
			this.getData();
		},
		goTo(row) {
			console.log('row', row);
			this.$router.push('search?id=' + row._id);
		},
		deleteRow(row) {
			this.row = row;
			this.visibleDeleteModal = true;
		},
		async getData() {
			try {
				var data = await axios.get('/api/listener/list');

				this.loaded = true;
				this.rows = data.data;
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
					rowsPerPage: 'Mostrando {rowsPerPage} escuchadores',
					rowsRange: 'Mostrando {rowsTo} de {rowsCount} escuchadores',
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
