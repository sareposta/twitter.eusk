<template>
	<main class="flex-1 overflow-x-hidden overflow-y-auto h-full">
		<loading :active.sync="isLoading"  :is-full-page="fullPage"></loading>

		<div class="container mx-auto px-6 py-8">
			<h3 class="text-gray-700 text-3xl font-semibold">Agregar Escuchador</h3>
			<div class="mt-8">
				<div class="mt-1">
					<div class="p-6 bg-white rounded-md shadow-md">
						<h4 class="text-gray-700 text-2xl font-semibold capitalize">{{ this.form.name }}</h4>

						<h2 class="text-lg text-gray-700 font-semibold capitalize">Configuración</h2>
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
							<div>
								<label class="text-gray-700" for="username">Nombre de el escuchador*</label>
								<i-input v-model="form.name" placeholder="Inserte nombre descriptivo del escuchador" />
							</div>

							<div>
								<label class="text-gray-700">Coleccion*</label>

								<v-select
									placeholder="seleccione"
									class="mt-2"
									v-model="form.collection"
									:options="collections"
								></v-select>
							</div>

							<div>
								<label class="text-gray-700" for="username">Todas estas palabras</label>
								<i-input v-model="form.allWords" placeholder="Inserte palabras de búsqueda" />
								<small>Contiene tanto "que" como "pasa"</small>
							</div>

							<div>
								<label class="text-gray-700">Frase exacta</label>
								<i-input v-model="form.exactPhrase" placeholder="contiene frase exacta" />
								<small>Ejemplo "hora feliz" - contiene la frase exacta "hora feliz"</small>
							</div>

							<div>
								<label class="text-gray-700" for="password">Cualquiera de estas palabras</label>
								<i-input
									v-model="form.includeWords"
									placeholder="Ejemplo: gatos,perros - contiene 'gatos' o 'perros'"
								/>
							</div>

							<div>
								<label class="text-gray-700">Ninguna de estas palabras</label>
								<i-input v-model="form.excludeWords" placeholder="Ejemplo: Ranas, sapos" />
							</div>

							<div>
								<label class="text-gray-700">Incluye estas cuentas</label>
								<i-input v-model="form.includeAccounts" placeholder="Ejemplo: @basque" />
							</div>

							<div>
								<label class="text-gray-700">Estos hashtags</label>
								<i-input
									v-model="form.hashtags"
									placeholder="Ejemplo: #JuevesDeAntaño - contiene el hashtags: 'jueves de antaño'"
								/>
							</div>

							<div>
								<label class="text-gray-700">Idioma</label>
								<v-select v-model="form.lang" :options="langs"></v-select>
							</div>
							<div>
								<label class="text-gray-700">Respuestas</label>

								<i-checkbox-group size="md" v-model="form.includeOriginal">
									<i-checkbox value="includeAnswersAndTweetsNotRepited"
										>Incluir respuestas y tweets originales</i-checkbox
									>
								</i-checkbox-group>
							</div>

							<div>
								<label class="text-gray-700">Enlaces</label>

								<i-checkbox-group size="md" v-model="form.hyperlinks">
									<i-checkbox value="includeHyperlinks">SI</i-checkbox>
								</i-checkbox-group>
							</div>

							<div>
								<label class="text-gray-700">Retweets</label>

								<i-checkbox-group size="md" v-model="form.retweets">
									<i-checkbox value="includeRetweets">SI</i-checkbox>
								</i-checkbox-group>
							</div>

							<div>
								<h2 class="text-lg text-gray-700 font-semibold capitalize">
									Configuración de interación
								</h2>
							</div>
							<div></div>

							<div>
								<label class="text-gray-700">Mínimo de respuestas</label>
								<i-input v-model="form.minAnswers" placeholder="0" />
							</div>

							<div>
								<label class="text-gray-700">Mínimo de me gusta</label>
								<i-input v-model="form.minLikes" placeholder="0" />
							</div>

							<div>
								<label class="text-gray-700">Mínimo de retweets</label>
								<i-input v-model="form.minRetweets" placeholder="0" />
							</div>

							<div></div>

							<div>
								<h2 class="text-lg text-gray-700 font-semibold capitalize">Fechas</h2>
							</div>
							<div></div>

							<div>
								<label class="text-gray-700">Desde</label>

								<datepicker
									v-model="form.startDate"
									placeholder="Seleccione"
									input-class="calendar"
									:value="date"
								></datepicker>
							</div>

							<div>
								<label class="text-gray-700">Hasta</label>

								<datepicker
									v-model="form.endDate"
									placeholder="Seleccione"
									input-class="calendar"
									:value="date"
								></datepicker>
							</div>

							<div>
								<h2 class="text-lg text-gray-700 font-semibold capitalize">
									Configuración de Ubicación
								</h2>
							</div>
							<div></div>

							<div>
								<label class="text-gray-700" for="password">Latitud</label>
								<i-input v-model="form.lat" placeholder="Latitud" />
							</div>

							<div>
								<label class="text-gray-700" for="password">Longitud</label>
								<i-input v-model="form.lng" placeholder="Longitud" />
							</div>
						</div>

						<div class="flex justify-end mt-4">
							<i-button :loading="loading" @click="addListener" size="lg" variant="dark"
								>AGREGAR</i-button
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
// Import component
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';
import Datepicker from 'vuejs-datepicker';
import axios from 'axios';
import languages from './languages';
export default {
	auth: true,
	layout: 'add',
	mounted() {
		this.formatLanguages();
		this.getCollections();
		if (this.$route.query.id) {
			this.getData();
		} else {
			this.isLoading = false;
		}
	},
	collection: null,
	components: {
		Datepicker,
		Loading,
	},
	methods: {
		formatLanguages() {
			this.langs = languages.map((l) => {
				return {
					label: l.name,
					value: l.code,
				};
			});
		},
		async getCollections() {
			try {
				var data = await axios.get('/api/collections/list');

				this.loaded = true;

				if (data.data.objects) {
					var rows = data.data.objects;
					if (rows.timelines) {
						var collections = Object.values(rows.timelines);

						this.collections = collections.map((collection) => {

							var url = collection.collection_url.split('/');
							var id = url[url.length - 1];

							console.log(collection)
							return {
								value: id,
								label: collection.name,
							};
						});
					}
				}
			} catch (error) {
				console.log(error);
			}
		},
		async getData() {
			var response = await axios.get('/api/listener/show?id=' + this.$route.query.id);
			this.form = response.data;
			this.isLoading = false;
		},
		async addListener() {
			try {
				if (this.form.name == '' || !this.form.name) {
					alert('El nombre es requerido.');
					return;
				}

				if (!this.form.collection) {
					alert('La colección es requerida.');
					return;
				}

				var strtDt = new Date(this.form.startDate);
				var endDt = new Date(this.form.endDate);
				var flag = 0; // false

				if (endDt <= strtDt) {
					alert('La fecha de fin debe de ser mayor.');
					return;
				}

				this.loading = true;
				if (this.$route.query.id) {
					var response = await axios.post('/api/listener/edit', this.form);
				} else {
					var response = await axios.post('/api/listener/create', this.form);
				}

				this.loading = false;

				this.$router.push('listeners');
			} catch (error) {}
		},
	},
	data() {
		return {
			fullPage: true,
			isLoading: true,
			loading: false,
			form: {
				lang: { label: 'Spanish; Castilian', value: 'es' },
			},
			date: '',
			langs: [],
			collections: [],
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
	padding-left: 0px;
}

.calendar {
	border: 1px solid black;
	background-color: #ffffff;
	border-color: #dee2e6;
	height: 35px;
	border-radius: 12px;
	padding: 5px;
}
</style>
