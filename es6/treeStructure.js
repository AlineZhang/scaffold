const  categoryTree =  [
    {
        "id": 539796,
        "name": "一级分类A一级分类A一级分类A一级分类A一级分类A一级分类A一级分类A一级分类A一级分类A一级分类A",
        "children": [
            {
                "id": 539797,
                "name": "二级分类B二级分类B二级分类B二级分类B二级分类B二级分类B二级分类B二级分类B二级分类B二级分类B",
                "children": [
                    {
                        "id": 539798,
                        "name": "三级分类C三级分类C三级分类C三级分类C三级分类C三级分类C三级分类C三级分类C三级分类C三级分类C",
                        "children": [
                            {
                                "id": 539799,
                                "name": "四级分类D四级分类D四级分类D四级分类D四级分类D四级分类D四级分类D四级分类D四级分类D四级分类D",
                                "children": [
                                    {
                                        "id": 539800,
                                        "name": "五级分类E五级分类E五级分类E五级分类E五级分类E五级分类E五级分类E五级分类E五级分类E五级分类E",
                                        "children": null,
                                        "cloud": false
                                    }
                                ],
                                "cloud": false
                            }
                        ],
                        "cloud": false
                    }
                ],
                "cloud": false
            }
        ],
        "cloud": false
    },
    {
        "id": 598032,
        "name": "jjj一级分类",
        "children": [
            {
                "id": 598033,
                "name": "jjj二级分类",
                "children": [
                    {
                        "id": 598034,
                        "name": "jjj三级分类",
                        "children": [
                            {
                                "id": 598035,
                                "name": "jjj四级分类",
                                "children": [
                                    {
                                        "id": 598036,
                                        "name": "jjj五级分类",
                                        "children": null,
                                        "cloud": false
                                    },
                                    {
                                        "id": 624314,
                                        "name": "jjj56555",
                                        "children": null,
                                        "cloud": false
                                    }
                                ],
                                "cloud": false
                            },
                            {
                                "id": 624313,
                                "name": "jjj444",
                                "children": null,
                                "cloud": false
                            }
                        ],
                        "cloud": false
                    },
                    {
                        "id": 624312,
                        "name": "jjj3333",
                        "children": null,
                        "cloud": false
                    }
                ],
                "cloud": false
            },
            {
                "id": 624310,
                "name": "jjj222",
                "children": null,
                "cloud": false
            },
            {
                "id": 624311,
                "name": "jjj2222",
                "children": [
                    {
                        "id": 625478,
                        "name": "12321",
                        "children": [
                            {
                                "id": 625479,
                                "name": "324532342",
                                "children": [
                                    {
                                        "id": 625480,
                                        "name": "64546",
                                        "children": null,
                                        "cloud": false
                                    }
                                ],
                                "cloud": false
                            }
                        ],
                        "cloud": false
                    }
                ],
                "cloud": false
            },
            {
                "id": 624357,
                "name": "11",
                "children": null,
                "cloud": false
            }
        ],
        "cloud": false
    },
    {
        "id": 598037,
        "name": "jjj分类A",
        "children": [
            {
                "id": 598039,
                "name": "jjj分类B",
                "children": null,
                "cloud": false
            }
        ],
        "cloud": false
    },
    {
        "id": 624356,
        "name": "11",
        "children": [
            {
                "id": 624358,
                "name": "11",
                "children": null,
                "cloud": false
            }
        ],
        "cloud": false
    },
    {
        "id": 630017,
        "name": "222222222",
        "children": null,
        "cloud": false
    },
    {
        "id": 630018,
        "name": "333333333333333",
        "children": null,
        "cloud": false
    },
    {
        "id": 629016,
        "name": "4444444444",
        "children": null,
        "cloud": false
    },
    {
        "id": 630020,
        "name": "爽歪歪",
        "children": null,
        "cloud": false
    },
    {
        "id": 630021,
        "name": "呜呜呜呜",
        "children": null,
        "cloud": false
    },
    {
        "id": 630022,
        "name": "嘞",
        "children": null,
        "cloud": false
    },
    {
        "id": 630023,
        "name": "哇啦啦啦",
        "children": null,
        "cloud": false
    },
    {
        "id": 630024,
        "name": "滴滴滴",
        "children": null,
        "cloud": false
    },
    {
        "id": 630025,
        "name": "我问问",
        "children": null,
        "cloud": false
    },
    {
        "id": 630026,
        "name": "我问我",
        "children": null,
        "cloud": false
    },
    {
        "id": 630027,
        "name": "嘻嘻嘻",
        "children": null,
        "cloud": false
    },
    {
        "id": 630028,
        "name": "去去去",
        "children": null,
        "cloud": false
    },
    {
        "id": 629017,
        "name": "22222",
        "children": null,
        "cloud": false
    },
    {
        "id": 629018,
        "name": "66666",
        "children": null,
        "cloud": false
    }
];



// treenode {id, name, children, parentId }
// climPath / leafPath  { ids[], names[] }
const structureTree = (tree) => {
    let depths = []; // depthList, depths
    let treeNodesMap = {}; // { id: treenode }
    let climMap = {}; // { id: treenode }
    let climPathsMap = {}; // { id: climPath }
    let leafMap = {};  // { id: treenode}
    let leafPathsMap = {}; // { id: leafPath }

    const climIterator = (climb, depth=0, parentId=0 ) => {
         
        if(!depths[depth]) { depths[depth] = [];}

        climb.forEach(node => {
            const { id, name, children=null, ...others } = node;
            const isLeaf = !children;
            const isNotRoot = !!parentId;
            
            let treeNode= { id, name, parentId, isLeaf, children, ...others };
            const treeNodeMap = { [id]: treeNode };
            treeNodesMap = { ...treeNodesMap, ...treeNodeMap };
            depths[depth].push(treeNode);

            /* let climNode = {};
            const parentPath = climPathsMap[parentId];
            if(isNotRoot && !parentPath) {
               const { ids, names } = parentPath;
               climNode = {...treeNode, parentPathIds: ids, parentPathNames: names };
            } else {
               climNode = {...treeNode, parentPathIds: [], parentPathNames: [] };
            }
            let climNodeMap = { [id]: climNode }; */

            // parentPath -> climNode
            let {ids:parentPathIds, names:parentPathNames} = climPathsMap[parentId] || {};
            // if(isNotRoot) {}
            let climNode = { ...treeNode, parentPathIds, parentPathNames};
            let climNodeMap = { [id]: climNode };

            // leaf | clim
            if(isLeaf) {
                leafMap = { ...leafMap, ...climNodeMap};
                let leafPath = {};
                if(!!parentPathIds) {
                    leafPath = {
                        ids: [...parentPathIds, id],
                        names: [...parentPathNames, name]
                    };
                } else {
                    leafPath = {
                        ids: [id],
                        names: [name]
                    };
                }
                let leafPathMap = { [id]: leafPath };
                leafPathsMap = { ...leafPathsMap, ...leafPathMap}
            } else {
                climMap = { ...climMap, ...climNodeMap };

                // subClim's parentClimPath 
                if(!climPathsMap[id]) {
                    let climPath = {};
                    if(!!parentPathIds) {
                        climPath = {
                            ids: [...parentPathIds, id],
                            names: [...parentPathNames, name]
                        };
                    } else {
                        climPath = {
                            ids: [id],
                            names: [name]
                        };
                    }
                    const climPathMap = { [id]: climPath };
                    climPathsMap = { ...climPathsMap, ...climPathMap};
                }

                climIterator(children, depth+1, id);
            }

        });
        
    };
    
    climIterator(tree);

    return { depths, treeNodesMap, climMap, climPathsMap, leafMap, leafPathsMap };
} 

/**
 * 1、遍历树节点 是否为叶子节点
 * 2、非叶子节点记录枝干路径、路径名称 继续遍历枝干叶子节点
 * 3、叶子节点 获取所属枝干路径及路径名
 */
const { depths, treeNodesMap, 
        climMap, climPathsMap, 
        leafMap, leafPathsMap 
    } = structureTree(categoryTree);

// console.log(depths,climMap);
