// Help content for all modules
const moduleHelpContent = {
    planetExplorer: {
        title: '🪐 Planet Explorer Guide',
        sections: [
            {
                heading: 'Overview',
                content: 'The Planet Explorer provides comprehensive planetary intelligence across all surveyed systems in the Star Atlas universe. Navigate between exploration and analytics modes to discover optimal resource extraction locations and strategic opportunities.'
            },
            {
                heading: 'Explorer Tab - Navigation',
                content: `
                    <ul>
                        <li><strong>Search Bar:</strong> Filter systems, planets, or resources by name in real-time</li>
                        <li><strong>System Checkboxes (Left Sidebar):</strong> Toggle visibility of entire star systems to focus your search</li>
                        <li><strong>Resource Checkboxes (Right Sidebar):</strong> Filter planets by specific resource availability</li>
                        <li><strong>Planet Cards:</strong> Click any planet to view detailed composition, orbital data, and resource richness values</li>
                    </ul>
                `
            },
            {
                heading: 'Analytics Tab - Resource Analytics',
                content: `
                    <p><strong>Regionally Limited Resources:</strong> Identifies resources that don't appear in all regions (determined by the first 3 characters of system names). Critical for regional trade strategy and supply chain planning.</p>
                    <p><strong>Scarcest Resources:</strong> Highlights the rarest materials in the galaxy based on total deposit count. These ultra-rare resources often command premium value.</p>
                    <p><strong>Highest Quality Resources:</strong> Ranks resources by average richness scores across all deposits. Higher richness = better extraction efficiency.</p>
                    <p><strong>Top Resource Locations:</strong> Systems ranked by unique resource diversity and strategic scores. Ideal for identifying multi-resource extraction hubs.</p>
                `
            },
            {
                heading: 'Analytics Tab - Manufacturing',
                content: `
                    <p>Analyzes each planet's manufacturing capabilities by cross-referencing available resources with crafting recipes.</p>
                    <p><strong>Self-Sufficiency Score:</strong> Percentage of recipes a planet can complete using only its local resources (no imports needed).</p>
                    <p><strong>Specialization Categories:</strong> Identifies what types of items each planet excels at producing based on resource availability.</p>
                    <p><strong>Craftable Recipes:</strong> Complete list of items manufacturable on each planet with resource breakdowns.</p>
                `
            },
            {
                heading: 'Analytics Tab - Territory',
                content: `
                    <p>Provides faction-level and regional planetary ownership analysis.</p>
                    <p><strong>Faction Distribution:</strong> Shows how many planets each faction controls across the galaxy.</p>
                    <p><strong>Regional Breakdowns:</strong> Analyzes planetary ownership patterns by galactic region for strategic planning.</p>
                `
            },
            {
                heading: 'Pro Tips',
                content: `
                    <ul>
                        <li>Use resource filters to find planets containing multiple ingredients for complex recipes</li>
                        <li>Cross-reference regionally limited resources with territory analytics to identify trade monopoly opportunities</li>
                        <li>Combine manufacturing analytics with resource richness data to find optimal production facility locations</li>
                        <li>Check strategic scores in Top Resource Locations to identify well-connected systems for logistics hubs</li>
                    </ul>
                `
            }
        ]
    },

    shipExplorer: {
        title: '🚀 Ship Explorer Guide',
        sections: [
            {
                heading: 'Overview',
                content: 'The Ship Explorer enables comprehensive fleet analysis by comparing ship specifications, configurations, and resource requirements. Toggle between ship and configuration views to optimize your fleet deployment strategy.'
            },
            {
                heading: 'Explorer Tab - Ship View',
                content: `
                    <ul>
                        <li><strong>View Toggle:</strong> Switch between Ships view (compare vessels) and Configurations view (compare loadouts)</li>
                        <li><strong>Search & Filter:</strong> Find specific ships or configurations by name</li>
                        <li><strong>Ship Selection:</strong> Check ships from the sidebar to add them to the comparison table</li>
                        <li><strong>Comparison Table:</strong> Side-by-side attribute comparison including hull stats, cargo capacity, and component slots</li>
                    </ul>
                `
            },
            {
                heading: 'Explorer Tab - Configuration View',
                content: `
                    <ul>
                        <li><strong>Configuration Comparison:</strong> Compare different ship loadouts and their specifications</li>
                        <li><strong>Component Analysis:</strong> Review installed components and their effects on ship performance</li>
                        <li><strong>Attribute Breakdown:</strong> Detailed stats showing how components modify base ship attributes</li>
                    </ul>
                `
            },
            {
                heading: 'Analytics Tab - Resource Analytics',
                content: `
                    <p>Analyzes the resource requirements for building ship configurations.</p>
                    <p><strong>Configuration Costs:</strong> Complete material breakdown for each ship configuration showing all required resources.</p>
                    <p><strong>Resource Aggregation:</strong> Identifies which resources are most commonly needed across multiple configurations.</p>
                    <p><strong>Build Planning:</strong> Helps prioritize resource gathering for fleet construction projects.</p>
                `
            },
            {
                heading: 'Pro Tips',
                content: `
                    <ul>
                        <li>Use configuration view to understand manufacturer design philosophies and loadout strategies</li>
                        <li>Compare ships within the same class to identify the best option for your operational needs</li>
                        <li>Check resource analytics before committing to fleet expansion plans</li>
                        <li>Use the comparison table to identify ships with specific component slot requirements</li>
                    </ul>
                `
            }
        ]
    },

    recipeExplorer: {
        title: '🧪 Recipe Explorer Guide',
        sections: [
            {
                heading: 'Overview',
                content: 'The Recipe Explorer visualizes crafting dependency trees and analyzes manufacturing complexity. Search by recipe name or ingredient to understand production chains from raw materials to finished products.'
            },
            {
                heading: 'Explorer Tab - Recipe Trees',
                content: `
                    <ul>
                        <li><strong>Search Modes:</strong> Toggle between Recipe Name search (find specific items) and Ingredient search (find all recipes using a material)</li>
                        <li><strong>Category Filters:</strong> Browse recipes by category to explore related manufacturing chains</li>
                        <li><strong>Tree Visualization:</strong> Interactive dependency tree showing how raw materials flow through intermediate products to final items</li>
                        <li><strong>Recipe Details:</strong> Click recipes to view construction time, tiers, and complete ingredient lists</li>
                    </ul>
                `
            },
            {
                heading: 'Analytics Tab - Recipe Complexity',
                content: `
                    <p>Analyzes recipes by complexity, construction time, and resource requirements.</p>
                    <p><strong>Most Complex Recipes:</strong> Identifies recipes requiring the most ingredients or processing steps.</p>
                    <p><strong>Longest Build Times:</strong> Shows which items take the most time to manufacture.</p>
                    <p><strong>Tier Distribution:</strong> Breaks down recipes by tier level for production planning.</p>
                    <p><strong>Ingredient Usage:</strong> Identifies which resources are most frequently used across all recipes.</p>
                `
            },
            {
                heading: 'Pro Tips',
                content: `
                    <ul>
                        <li>Use ingredient search to identify alternative recipes when a material becomes scarce</li>
                        <li>Check dependency trees before establishing manufacturing facilities to ensure you can produce all intermediates</li>
                        <li>Review construction times to prioritize early-stage production of long-build items</li>
                        <li>Cross-reference with Planet Explorer to find locations with all raw materials for complex recipes</li>
                    </ul>
                `
            }
        ]
    },

    claimStakeExplorer: {
        title: '🏗️ ClaimStake Explorer Guide',
        sections: [
            {
                heading: 'Overview',
                content: 'The ClaimStake Explorer provides comprehensive building and facility analysis for planetary claim development. Compare structures, plan construction projects, and optimize facility placement with tier-aware filtering and resource calculations.'
            },
            {
                heading: 'Explorer Tab - Building Search',
                content: `
                    <ul>
                        <li><strong>Search & Filters:</strong> Find buildings by name and filter by tier, special properties, or functions</li>
                        <li><strong>Tier Filtering:</strong> Browse buildings by tier level to match planet resource availability</li>
                        <li><strong>Property Filters:</strong> Filter by "Comes with Stake," "Cannot Remove," or "Has Resource Extraction"</li>
                        <li><strong>Function Filters:</strong> Find buildings that enable Processing Hubs, Storage Hubs, Extraction Hubs, or Farm Hubs</li>
                        <li><strong>Building Cards:</strong> Detailed specifications including construction costs, slots, and capabilities</li>
                    </ul>
                `
            },
            {
                heading: 'Analytics Tab - Facility Analysis',
                content: `
                    <p>Provides insights into building costs, efficiency, and strategic value.</p>
                    <p><strong>Cost Analysis:</strong> Compares construction resource requirements across different building types and tiers.</p>
                    <p><strong>Efficiency Metrics:</strong> Analyzes buildings by storage capacity, job slots, and resource extraction rates.</p>
                    <p><strong>ROI Calculations:</strong> Helps identify the most cost-effective buildings for specific functions.</p>
                `
            },
            {
                heading: 'Construction Tab - Build Planning',
                content: `
                    <p>Plan complete facility builds with resource aggregation.</p>
                    <p><strong>Build Queue:</strong> Add multiple buildings to create a construction plan.</p>
                    <p><strong>Resource Totals:</strong> Automatically calculates total materials needed for your entire build.</p>
                    <p><strong>Time Estimates:</strong> Shows total construction time for the planned facilities.</p>
                `
            },
            {
                heading: 'Pro Tips',
                content: `
                    <ul>
                        <li>Use tier filters to match buildings with your planet's available resource tiers</li>
                        <li>Check "Comes with Stake" buildings for cost-effective initial claim setups</li>
                        <li>Plan extraction facilities around planets with high-richness resource deposits</li>
                        <li>Use the Construction tab to calculate total resources before starting major builds</li>
                    </ul>
                `
            }
        ]
    },

    resourcesExplorer: {
        title: '⚒️ Resources Explorer Guide',
        sections: [
            {
                heading: 'Overview',
                content: 'The Resources Explorer catalogues all materials in the Star Atlas economy. Search, filter, and analyze resources by category, tier, value, and usage to optimize trading and production strategies.'
            },
            {
                heading: 'Explorer Tab - Resource Browser',
                content: `
                    <ul>
                        <li><strong>Search:</strong> Find resources by name in real-time</li>
                        <li><strong>Category Filters:</strong> Browse by resource type (raw materials, processed goods, components, etc.)</li>
                        <li><strong>Tier Filters:</strong> Filter resources by tier level to match planet availability or recipe requirements</li>
                        <li><strong>Resource Cards:</strong> View detailed information including base value, category, tier, and description</li>
                    </ul>
                `
            },
            {
                heading: 'Analytics Tab - Value & Distribution',
                content: `
                    <p><strong>Most Valuable Resources:</strong> Ranks resources by base value for trading prioritization.</p>
                    <p><strong>Category Distribution:</strong> Shows how resources are distributed across different categories.</p>
                    <p><strong>Tier Analysis:</strong> Breaks down resource counts by tier level.</p>
                    <p><strong>Rarity Metrics:</strong> Identifies which resources are least common in the economy.</p>
                `
            },
            {
                heading: 'Analytics Tab - Resource Flow',
                content: `
                    <p>Traces how resources are used across recipes and manufacturing chains.</p>
                    <p><strong>Input Analysis:</strong> Shows which recipes consume each resource.</p>
                    <p><strong>Output Tracking:</strong> Identifies which recipes produce each resource.</p>
                    <p><strong>Conversion Paths:</strong> Maps how raw materials transform into processed goods.</p>
                `
            },
            {
                heading: 'Pro Tips',
                content: `
                    <ul>
                        <li>Cross-reference valuable resources with Planet Explorer to find extraction locations</li>
                        <li>Use Resource Flow analytics to identify bottleneck materials in production chains</li>
                        <li>Filter by tier when planning facilities to ensure you can extract required materials locally</li>
                        <li>Track input/output relationships to find profitable conversion opportunities</li>
                    </ul>
                `
            }
        ]
    },

    hubExplorer: {
        title: '🏠 Hub Explorer Guide',
        sections: [
            {
                heading: 'Overview',
                content: 'The Hub Explorer specializes in habitat construction planning. Compare habitat modules, crafting stations, storage solutions, and create complete hab builds with resource calculations.'
            },
            {
                heading: 'Hubs Tab - Habitat Modules',
                content: `
                    <ul>
                        <li><strong>Habitat Tiers:</strong> Browse different habitat module tiers and their upgrade paths</li>
                        <li><strong>Landing Pads:</strong> Compare landing pad options for ship docking</li>
                        <li><strong>Decorative Enhancements:</strong> Explore aesthetic improvements and their benefits</li>
                        <li><strong>Module Details:</strong> View construction costs, slots required, and capabilities for each module</li>
                    </ul>
                `
            },
            {
                heading: 'Crafting Tab - Station Comparison',
                content: `
                    <p>Compare crafting stations across different sizes and efficiency levels.</p>
                    <p><strong>Capacity Analysis:</strong> Shows how many concurrent jobs each station can handle.</p>
                    <p><strong>Efficiency Ratings:</strong> Compares crafting speed and resource consumption across station types.</p>
                    <p><strong>Space Requirements:</strong> Helps optimize station placement within limited hab slots.</p>
                `
            },
            {
                heading: 'Storage Tab - Capacity Calculator',
                content: `
                    <p>Calculate storage capacity and plan cargo infrastructure.</p>
                    <p><strong>Storage Types:</strong> Compare different cargo storage options.</p>
                    <p><strong>Capacity Planning:</strong> Determine how many storage units you need for operations.</p>
                    <p><strong>Efficiency Metrics:</strong> Identifies the most space-efficient storage solutions.</p>
                `
            },
            {
                heading: 'Planner Tab - Build Planning',
                content: `
                    <ul>
                        <li><strong>Add Buildings:</strong> Select modules, stations, and storage to create your custom hab plan</li>
                        <li><strong>Resource Totals:</strong> Automatically calculates total construction materials needed</li>
                        <li><strong>Slot Management:</strong> Tracks total slots used to ensure you don't exceed hab capacity</li>
                        <li><strong>Time Estimates:</strong> Shows total construction time for your planned build</li>
                    </ul>
                `
            },
            {
                heading: 'Pro Tips',
                content: `
                    <ul>
                        <li>Plan habitat upgrades in advance using the Planner to ensure you have all resources</li>
                        <li>Compare crafting station efficiency before committing to large station installations</li>
                        <li>Balance storage capacity with production needs to avoid bottlenecks</li>
                        <li>Use the resource totals in Planner to coordinate material gathering before construction</li>
                    </ul>
                `
            }
        ]
    },

    regionMapExplorer: {
        title: '🗺️ Region Map Explorer Guide',
        sections: [
            {
                heading: 'Overview',
                content: 'The Region Map Explorer provides an interactive 2D visualization of all Galia regions. Click systems to view ownership, connections, and strategic positioning. Includes a Conquest Simulator for territorial planning.'
            },
            {
                heading: 'Map Navigation',
                content: `
                    <ul>
                        <li><strong>Interactive Canvas:</strong> Click and drag to pan, scroll to zoom in/out</li>
                        <li><strong>System Selection:</strong> Click any system to view detailed information in the sidebar</li>
                        <li><strong>Show Connections:</strong> Toggle to display/hide warp lane connections between systems</li>
                        <li><strong>Highlight Connections:</strong> Enable to highlight only connections from the selected system</li>
                        <li><strong>Show Labels:</strong> Toggle system name labels on/off for cleaner viewing</li>
                        <li><strong>Reset View:</strong> Return to default zoom and position</li>
                    </ul>
                `
            },
            {
                heading: 'System Information',
                content: `
                    <p>When you select a system, the sidebar displays:</p>
                    <p><strong>Ownership:</strong> Current faction controlling the system (MUD, ONI, UST, or MRZ neutral).</p>
                    <p><strong>Strategic Status:</strong> Shows if system is a King system (region capital), Core system, or regular territory.</p>
                    <p><strong>Connections:</strong> Lists all directly connected systems via warp lanes.</p>
                    <p><strong>Distance Info:</strong> Shows warp distances to neighboring systems for travel planning.</p>
                `
            },
            {
                heading: 'Conquest Simulator',
                content: `
                    <ul>
                        <li><strong>Faction Selection:</strong> Choose MUD, ONI, or UST as the attacking faction</li>
                        <li><strong>Conquer Systems:</strong> Click systems to assign them to your selected faction</li>
                        <li><strong>Region Automation:</strong> Click region labels to automatically conquer all systems + neighbors (makes region SAFE)</li>
                        <li><strong>Status Icons:</strong> King systems shown with crowns 👑, Core systems with stars ⭐</li>
                        <li><strong>Requirements:</strong> Claim = King + 60% Core | Border→Neutral = 40% Core | Safe = All systems + neighbors</li>
                        <li><strong>Reset:</strong> Clear all conquest changes and return to default ownership</li>
                    </ul>
                `
            },
            {
                heading: 'Legend & Indicators',
                content: `
                    <p><strong>Faction Colors:</strong> Red (MUD), Blue (ONI), Orange (UST), Gray (MRZ Neutral)</p>
                    <p><strong>Connection Lines:</strong> Cyan lines = intra-region connections, Magenta lines = inter-region connections</p>
                    <p><strong>System Markers:</strong> Crown icon = King system (region capital), Star icon = Core system</p>
                `
            },
            {
                heading: 'Pro Tips',
                content: `
                    <ul>
                        <li>Use the Conquest Simulator to plan faction expansion strategies before committing resources</li>
                        <li>Highlight connections from border systems to identify strategic warp lanes</li>
                        <li>Click region labels with a faction selected to quickly visualize full regional control</li>
                        <li>Cross-reference with Planet Explorer to find resource-rich systems in strategic locations</li>
                        <li>Use distance information to plan efficient supply routes between systems</li>
                    </ul>
                `
            }
        ]
    }
};
