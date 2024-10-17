<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
</script>

<div class="shrink-0 border-b">
	<div class="flex justify-between px-4 py-2">
		<div class="shrink-0 items-center">
			<slot name="left" />
		</div>
		<div class="">
			<slot name="center" />
		</div>
		<div class="flex shrink-0 items-center">
			<slot name="right" />
		</div>
	</div>
</div>

<!-- 
	@component 

	### Slots
	- left - the left side of the navbar
	- center - the center of the navbar
	- right - the right side of the navbar
	
-->
