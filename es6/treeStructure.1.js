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



// treenode {id, name, children, parentId, ...others }
// climPath / leafPath  { ids[], names[] }
let depths =[];
const structureTree = (tree, depth=0) => {
    // let depths = []; // depthList, depths

    let climMap = {}; // { id: treenode }
    let climPathsMap = {}; // { id: climPath } 
    let leafMap = {};  // { id: treenode}
    let leafPathsMap = {}; // { id: leafPath }
    let treeNodesMap = {}; // { id: treenode }

    
    let depthList = [];
    tree.forEach(node => {
        const { id, name, parentId=0, children=null, ...others } = node;
        const isLeaf = !children;

        const treeNode = { id, name, parentId, isLeaf, children, ...others };
        const treeNodeMap = { [id]: treeNode };
        treeNodesMap = { ...treeNodesMap, ...treeNodeMap };
        depthList.push(treeNode);

        const isRoot = !!parentId;
        if(isLeaf) {
            let leafPathMap = {};
            let leafPath;
            if(isRoot) {
                leafPath = { ids: [id], names: [name] };
            } else {
                let {ids: parentIds, names: parentNames } = parentPath;
                leafPath = {
                          id: { 
                            ids: parentIds.push(id), 
                            names: parentNames.push(name) 
                            }
                        };
            }

            leafMap = { ...leafMap, ...treeNodeMap };

            leafPathMap = { [id]: leafPath };
            leafPathsMap = { ...leafPathsMap, ...leafPathMap };
        } else {
            let { depths: subDepths, treeNodesMap: subTreeNodesMap, climPathsMap: subClimPathsMap, leafPathsMap: subLeafPathsMap  } = structureTree(children, depth+1);
            let climPathMap={};
            if(!isRoot) {
              climPathMap = climPathsMap[id];// { ids, names };
              let climPath={};
              if(climPath) {
                  climPath = { ids: [...climPath.ids, id], names: [...climPath.names, name] };
              } else {
                  climPath = { ids: [id], names: [name]};
              }
              climPathMap = { [id]: climPath };
            } 
            // subClimPathsMap.map(subClim => ([id, ...subClim]));
            climMap = { ...climMap, ...treeNodeMap };
            climPathsMap = { ...climPathsMap, ...climPathMap };
            treeNodesMap = { ...treeNodesMap, ...subTreeNodesMap };
            leafPathsMap = { ...leafPathsMap, ...subLeafPathsMap };
        }


    });
    if(depths[depth]) { depths[depth] = [];}
    depths[depth] = depthList;
    return { depths, treeNodesMap, climPathsMap, leafPathsMap };
} 
/**
 * 1、遍历树节点 是否为叶子节点
 * 2、非叶子节点记录枝干路径、路径名称 继续遍历枝干叶子节点
 *  <1> 是否是
 * 3、叶子节点 获取所属枝干路径及路径名
 */
