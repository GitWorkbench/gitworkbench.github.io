export function mountHistoryReplay(root: Document, view: Window | null = root.defaultView): void {
  for (const demo of root.querySelectorAll<HTMLElement>('[data-history-demo]')) {
    const range = demo.querySelector<HTMLInputElement>('[data-history-range]');
    const controls = demo.querySelector<HTMLElement>('[data-history-controls]');
    const previous = demo.querySelector<HTMLButtonElement>('[data-history-action="previous"]');
    const next = demo.querySelector<HTMLButtonElement>('[data-history-action="next"]');
    const play = demo.querySelector<HTMLButtonElement>('[data-history-action="play"]');
    const output = demo.querySelector<HTMLOutputElement>('[data-history-step-output]');
    const progress = demo.querySelector<HTMLElement>('[data-history-progress]');
    const status = demo.querySelector<HTMLElement>('[data-history-demo-status]');
    const cards = [...demo.querySelectorAll<HTMLElement>('[data-history-step]')];
    const nodes = [...demo.querySelectorAll<SVGCircleElement>('[data-history-node]')];
    const edges = [...demo.querySelectorAll<SVGPathElement>('[data-history-edge]')];
    const ring = demo.querySelector<SVGCircleElement>('[data-history-current-ring]');

    if (!range || !controls || !previous || !next || !play || !output || !progress || !status || cards.length === 0) continue;

    const cardSteps = cards.map((card) => Number(card.dataset.historyStep));
    const minimumCardStep = Math.min(...cardSteps);
    const maximumCardStep = Math.max(...cardSteps);
    const min = Math.max(Number(range.min), minimumCardStep);
    const max = Math.min(Number(range.max), maximumCardStep);
    const stepsAreValid = cardSteps.every(Number.isInteger)
      && new Set(cardSteps).size === cardSteps.length
      && cardSteps.length === maximumCardStep - minimumCardStep + 1;
    if (!stepsAreValid || !Number.isInteger(min) || !Number.isInteger(max) || min > max) continue;

    const motionPreference = view?.matchMedia?.('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionPreference?.matches ?? false;
    let current = Number(range.value);
    let timer: number | undefined;

    const selectedCard = (step: number) => cards.find((card) => Number(card.dataset.historyStep) === step);
    const selectedMessage = (step: number) => selectedCard(step)?.querySelector('h3')?.textContent?.trim() ?? 'sample commit';

    const setPlayButton = () => {
      const playing = timer !== undefined;
      play.textContent = playing ? 'Pause' : 'Play';
      play.setAttribute('aria-label', playing ? 'Pause history replay' : 'Play history replay');
      play.disabled = reducedMotion || !view || max === min;
    };

    const setStep = (value: number) => {
      const safeValue = Number.isFinite(value) ? Math.round(value) : min;
      current = Math.min(max, Math.max(min, safeValue));
      range.value = String(current);
      range.setAttribute('aria-valuetext', `Commit ${current} of ${max}: ${selectedMessage(current)}`);
      output.value = `${current} / ${max}`;
      progress.textContent = `Step ${current} of ${max}`;

      for (const card of cards) card.hidden = Number(card.dataset.historyStep) !== current;
      for (const node of nodes) {
        const step = Number(node.dataset.historyNode);
        node.dataset.active = String(Number.isFinite(step) && step <= current);
        node.dataset.current = String(step === current);
      }
      for (const edge of edges) {
        const step = Number(edge.dataset.historyEdge);
        edge.dataset.active = String(Number.isFinite(step) && step <= current);
      }

      const currentNode = nodes.find((node) => Number(node.dataset.historyNode) === current);
      const x = currentNode?.getAttribute('cx');
      const y = currentNode?.getAttribute('cy');
      if (ring && x && y) {
        ring.setAttribute('cx', x);
        ring.setAttribute('cy', y);
      }
      previous.disabled = current <= min;
      next.disabled = current >= max;
    };

    const pause = (message = 'Replay paused.') => {
      if (timer !== undefined && view) view.clearInterval(timer);
      timer = undefined;
      setPlayButton();
      status.textContent = message;
    };

    const stepForward = () => {
      if (current >= max) {
        pause('Replay complete.');
        return;
      }
      setStep(current + 1);
      if (current >= max) pause('Replay complete.');
    };

    setStep(Number.isFinite(current) ? current : min);
    controls.hidden = false;
    setPlayButton();
    status.textContent = reducedMotion
      ? 'Reduced motion is enabled. Use Previous, Next, or the slider to explore.'
      : 'Use the slider, arrow keys, or Play to explore the sample history.';

    range.addEventListener('input', () => {
      pause();
      setStep(Number(range.value));
    });
    previous.addEventListener('click', () => {
      pause();
      setStep(current - 1);
    });
    next.addEventListener('click', () => {
      pause();
      setStep(current + 1);
    });
    play.addEventListener('click', () => {
      if (reducedMotion || !view) return;
      if (timer !== undefined) {
        pause();
        return;
      }
      if (current >= max) setStep(min);
      status.textContent = 'Playing the sample history. Select Pause to stop.';
      timer = view.setInterval(stepForward, 1600);
      setPlayButton();
    });

    motionPreference?.addEventListener('change', (event) => {
      reducedMotion = event.matches;
      if (reducedMotion) {
        pause('Reduced motion is enabled. Use Previous, Next, or the slider to explore.');
      } else {
        setPlayButton();
        status.textContent = 'Use the slider, arrow keys, or Play to explore the sample history.';
      }
    });

    root.addEventListener('visibilitychange', () => {
      if (root.visibilityState === 'hidden' && timer !== undefined) pause('Replay paused when this tab became hidden.');
    });
  }
}
