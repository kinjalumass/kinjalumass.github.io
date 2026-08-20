/**
 * The BCU work, broken into case studies.
 *
 * This is one collaborative research project, not five separate ones — the
 * page says so plainly. What is listed here is the work Kinjal contributed,
 * grouped by the problem each part solves. The repository also contains
 * substantial work by other people (LTS graph construction, OD generation,
 * road usage, corridor and one-way analysis) which is deliberately not
 * claimed here.
 *
 * Links point at UMassCDS/BCU-Graph-Analysis — the canonical upstream repo,
 * which is public and MIT licensed. That is also where the merged pull
 * requests live, and a merged PR is far better evidence of authorship than a
 * file path. Kinjal's fork is linked separately as a copy she controls.
 *
 * Every figure below is taken from the validation notes in her own merged
 * PRs (#4, #11, #12, #17, #21) rather than estimated.
 */

const UPSTREAM = 'https://github.com/UMassCDS/BCU-Graph-Analysis';
const SRC = `${UPSTREAM}/blob/main/src/bcu_analysis`;
const TREE = `${UPSTREAM}/tree/main/src/bcu_analysis`;
const PR = (n: number) => `${UPSTREAM}/pull/${n}`;

export interface CaseFile {
  label: string;
  href: string;
  /** Merged pull requests get a stronger visual treatment */
  pr?: boolean;
}

export interface CaseStudy {
  index: string;
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  points: string[];
  tech: string[];
  files: CaseFile[];
  metrics?: { value: string; label: string }[];
}

export const BCU = {
  title: 'Bicycle Accessibility & Equity in Greater Boston',
  repoName: 'UMassCDS/BCU-Graph-Analysis',
  repo: UPSTREAM,
  fork: 'https://github.com/kinjalumass/BCU-Graph-Analysis',
  partner: 'Boston Cyclists Union',
  program: 'UMass Center for Data Science & AI: Data Science for the Common Good, 2026',
  lede:
    'A research collaboration asking a question the city could not answer: how much of Boston’s bicycle network is actually reachable, once you account for how stressful the roads are to ride, and does that reachability fall unevenly across the people who live there?',
  context: [
    'Cycling infrastructure is usually assessed by what exists, miles of lane, counts of intersections. That says nothing about whether a rider can actually get anywhere without being forced onto a road they would not ride. Level of Traffic Stress captures how unpleasant a link is; combining it with network structure turns "what exists" into "what is usable".',
    'The second half of the question is who that lands on. Once accessibility is scored at every intersection, it can be joined to Census demographics and tested for whether the shortfall is evenly distributed, which is the part an advocacy organization can take into a policy conversation.',
  ],
  attribution:
    'A team project. The case studies below are the parts Kinjal built and merged, each linked to its pull request. The repository also contains substantial work by others (LTS graph construction, origin-destination demand generation, road usage, corridor and one-way analysis) which is not claimed here.',
  /** Headline figures, all from merged-PR validation notes */
  headline: [
    { value: '96,232', label: 'Nodes analyzed' },
    { value: '929,540', label: 'Residents allocated' },
    { value: '279', label: 'Census tracts' },
    { value: '6', label: 'Merged pull requests' },
  ],
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    index: '01',
    slug: 'population-allocation',
    title: 'Census-to-network population allocation',
    kicker: 'Getting people onto a graph',
    summary:
      'Census data describes tracts. A road network describes intersections. Nothing connects the two, so before any equity question can be asked, population has to be moved onto the graph, deterministically, and without inventing or losing anyone.',
    points: [
      'Assigns tract population to nodes using clipped Voronoi area shares: nearest-node regions built across the street network, clipped to tract boundaries, matched with a KD-tree.',
      'Computes areas in EPSG:26986 for metric accuracy while emitting EPSG:4326 for web and downstream use.',
      'Conserves population by construction, with a unit test asserting it rather than an assumption that it holds.',
      'Consolidated into one command-line interface covering Boston, Brookline, Cambridge, Somerville and combined Greater Boston, with the graph path required explicitly so a stale local GraphML can never be mistaken for the canonical one.',
    ],
    metrics: [
      { value: '929,540', label: 'Population assigned' },
      { value: '279', label: 'Tracts covered' },
      { value: '112,696', label: 'Allocation rows' },
    ],
    tech: ['Python', 'GeoPandas', 'KD-tree', 'Voronoi', 'EPSG:26986', 'Census TIGER'],
    files: [
      { label: 'PR #4: deterministic assignment', href: PR(4), pr: true },
      { label: 'PR #11: unified region CLI', href: PR(11), pr: true },
      { label: 'assignment.py', href: `${SRC}/census/assignment.py` },
      { label: 'run_census_assignment.py', href: `${SRC}/census/run_census_assignment.py` },
    ],
  },
  {
    index: '02',
    slug: 'accessibility-engine',
    title: 'Stress-aware accessibility, at city scale',
    kicker: 'The core metric, and the machinery to run it',
    summary:
      'A graph algorithm measuring how much of the network is reachable from each intersection under traffic-stress-aware travel costs, compared against an ideal distance-only network. The ratio (between 0 and 1) is how much connectivity the stressful infrastructure costs you.',
    points: [
      'Bounded graph expansion under a configurable travel budget, handling loops, parallel edges and physical-road deduplication so one street is never counted twice.',
      'Scored against a distance-only counterfactual, which is what makes the number interpretable rather than merely relative.',
      'Runs in full, by shard, or as Slurm array jobs, with checkpointing, recovery of interrupted runs and shard merging.',
      'Benchmarked before committing compute, and validated for exact node alignment between the pruned graph and the accessibility results.',
    ],
    metrics: [
      { value: '96,232', label: 'Nodes scored' },
      { value: '277,077', label: 'Directed edges' },
      { value: '0–1', label: 'Relative accessibility' },
    ],
    tech: ['Python', 'NetworkX', 'Graph algorithms', 'Slurm', 'HPC', 'Checkpointing'],
    files: [
      { label: 'PR #21: merged into main', href: PR(21), pr: true },
      { label: 'node_accessibility/', href: `${TREE}/node_accessibility` },
      { label: 'accessibility.py', href: `${SRC}/node_accessibility/accessibility.py` },
      { label: 'run_shard.py', href: `${SRC}/node_accessibility/run_shard.py` },
      { label: 'benchmark.py', href: `${SRC}/node_accessibility/benchmark.py` },
    ],
  },
  {
    index: '03',
    slug: 'graph-pruning',
    title: 'Network cleaning & graph quality auditing',
    kicker: 'Deciding what is not really part of the network',
    summary:
      'A real OSM-derived road graph carries disconnected fragments, driveways, parking aisles, mapping artefacts. Left in, they distort every accessibility score. Removing them by hand is neither reproducible nor defensible, so the pruning is a pipeline with an audit trail.',
    points: [
      'Inventories every weakly connected component and calculates its unique physical road mileage.',
      'Always retains the largest component, then removes isolated nodes, components with no physical road segments, and components holding under a quarter-mile of road.',
      'Writes audit files listing all components, removed components, removed nodes and a run summary, so a reviewer can check the decision, not just the outcome.',
    ],
    metrics: [
      { value: '97,850 → 96,232', label: 'Nodes, before and after' },
      { value: '658', label: 'Components removed' },
      { value: '0.25 mi', label: 'Pruning threshold' },
    ],
    tech: ['Python', 'NetworkX', 'OSM', 'GraphML', 'Data QA'],
    files: [
      { label: 'PR #12: reproducible pruning', href: PR(12), pr: true },
      { label: 'prune_analysis_graph.py', href: `${SRC}/node_accessibility/prune_analysis_graph.py` },
    ],
  },
  {
    index: '04',
    slug: 'equity-analysis',
    title: 'Accessibility & demographic equity',
    kicker: 'Who the shortfall actually falls on',
    summary:
      'With population on the graph and accessibility scored at every node, the question becomes statistical: does bicycle accessibility differ systematically across demographic groups, and does that survive honest treatment of multiple testing?',
    points: [
      'An ACS pipeline pulling age, race and ethnicity, poverty, household income, vehicle access, renter status, disability and limited-English households, with consistency checks against assigned population.',
      'Tract demographics converted to node-level features and joined to accessibility scores, producing population-weighted measures and dominant-tract assignments.',
      'Population-weighted least-squares regressions at node level, with a mathematically duplicate specification identified and removed rather than quietly reported.',
      'Benjamini–Hochberg FDR correction across the retained specifications, the difference between a finding and a fishing expedition.',
      'A parallel tract-level model over 273 tracts giving a geographically interpretable view, retaining weighting, diagnostics, effect sizes and R².',
    ],
    metrics: [
      { value: '17', label: 'Node-level specifications' },
      { value: '34', label: 'Tract-level specifications' },
      { value: 'FDR', label: 'Multiple-testing correction' },
    ],
    tech: ['Python', 'statsmodels', 'WLS regression', 'Benjamini–Hochberg', 'Census ACS'],
    files: [
      { label: 'PR #17: regressions & sensitivity', href: PR(17), pr: true },
      { label: 'download_greater_boston_demographics.py', href: `${SRC}/census/download_greater_boston_demographics.py` },
      { label: 'assign_demographics_to_pruned_nodes.py', href: `${SRC}/census/assign_demographics_to_pruned_nodes.py` },
      { label: 'run_accessibility_regressions.py', href: `${SRC}/census/run_accessibility_regressions.py` },
      { label: 'run_tract_accessibility_regressions.py', href: `${SRC}/census/run_tract_accessibility_regressions.py` },
    ],
  },
  {
    index: '05',
    slug: 'sensitivity-maps',
    title: 'Sensitivity testing, mapping & reproducibility',
    kicker: 'Does the result hold, and can anyone else run it?',
    summary:
      'A finding that only exists at one set of assumptions is not a finding. This is the robustness work (re-running with the network and the spatial scale changed) plus the browser maps that let a non-technical partner explore the result, and the hardening that lets someone else reproduce it.',
    points: [
      'Recomputes accessibility with LTS 0 links excluded, testing whether the patterns depend on that classification.',
      'Repeats the analysis across 1.5, 2.0 and 2.5-mile travel budgets, so conclusions are not an artefact of one arbitrary radius.',
      'An interactive atlas layering demographics, accessibility, regression estimates, predictions and residuals, observed against expected, in the browser.',
      'Regression scatterplots with prediction curves and statistical annotations, collected into an HTML gallery so findings travel beyond a coefficient table.',
      'Machine-specific filesystem paths removed across the wider pipeline (destination extraction, LTS diagnostics, OD demand, route asymmetry) so the analysis runs the same locally and on UMass HPC, with no change to results.',
    ],
    metrics: [
      { value: '3', label: 'Distance cutoffs tested' },
      { value: '27', label: 'Repository tests passing' },
      { value: '3.10–3.12', label: 'Python versions in CI' },
    ],
    tech: ['Python', 'Folium', 'GeoJSON', 'Sensitivity analysis', 'Ruff', 'GitHub Actions'],
    files: [
      { label: 'PR #18: pipeline hardening', href: PR(18), pr: true },
      { label: 'visualize_pruned_nodes_lts0.py', href: `${SRC}/node_accessibility/visualize_pruned_nodes_lts0.py` },
      { label: 'create_tract_regression_maps.py', href: `${SRC}/census/create_tract_regression_maps.py` },
      { label: 'plot_notable_regression_scatterplots.py', href: `${SRC}/census/plot_notable_regression_scatterplots.py` },
      { label: 'create_multi_cutoff_node_map_wrapper.py', href: `${SRC}/node_accessibility/create_multi_cutoff_node_map_wrapper.py` },
    ],
  },
];

/* ===========================================================
   Photography

   Two frames only. There were five, and they were all the same
   cohort on the same staircase, repetition that made the page
   look padded rather than illustrated.

   ⚠️  CAPTIONS NEED A CHECK. I can identify the program and the
   setting, but not who is in each frame, correct the captions
   and add photographer credit.
   =========================================================== */

export interface Plate {
  src: string;
  alt: string;
  caption: string;
}

/** Establishing band under the context section. */
export const BCU_COHORT: Plate = {
  src: 'img/bcu/cohort-stairs.jpg',
  alt: 'The Data Science for the Common Good cohort seated on the atrium stairs',
  caption:
    'Data Science for the Common Good, the 2026 cohort, UMass Center for Data Science and Artificial Intelligence.',
};

/** Sits alongside the attribution note, because that note is about the team. */
export const BCU_TEAM: Plate = {
  src: 'img/bcu/team-standing.jpg',
  alt: 'The project team standing together in the atrium',
  caption: 'The project team.',
};
