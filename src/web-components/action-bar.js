const template = `<div class="action-bar">
			<div class="action-one">
				<div class="id">1</div>
			</div>
			<div class="action-two">
				<div class="id">2</div>
			</div>
			<div class="action-three">
				<div class="id">3</div>
			</div>
			<div class="action-four">
				<div class="id">4</div>
			</div>
			<div class="action-five">
				<div class="id">5</div>
			</div>
			<div class="action-six">
				<div class="id">6</div>
			</div>
			<div class="action-seven">
				<div class="id">7</div>
			</div>
			<div class="action-eight">
				<div class="id">8</div>
			</div>
			<div class="action-nine">
				<div class="id">9</div>
			</div>
			<div class="action-ten">
				<div class="id">10</div>
			</div>
		</div>`;

class ActionBar extends HTMLElement {
  constructor() {
    super();
    this.attatchShadow({ mode: "open" });

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
