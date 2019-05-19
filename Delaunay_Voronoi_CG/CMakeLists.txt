project( Delaunay_Voronoi_CG )

cmake_minimum_required(VERSION 3.1)

if(NOT POLICY CMP0070 AND POLICY CMP0053)
  # Only set CMP0053 to OLD with CMake<3.10, otherwise there is a warning.
  cmake_policy(SET CMP0053 OLD)
endif()

if(POLICY CMP0071)
  cmake_policy(SET CMP0071 NEW)
endif()

set(CMAKE_AUTOMOC TRUE)
set(CMAKE_INCLUDE_CURRENT_DIR TRUE)

find_package(CGAL COMPONENTS Qt5)
find_package(Qt5 QUIET COMPONENTS Widgets)

if(CGAL_Qt5_FOUND)
  add_definitions(-DQT_NO_KEYWORDS)
  set(CMAKE_INCLUDE_CURRENT_DIR ON)
endif()

if ( CGAL_FOUND )
#--------------------------------
# The "Delaunay" demo: Delaunay_triangulation_2
#--------------------------------
qt5_wrap_ui( D_UI_FILES delaunay_voronoi.cg.ui)
# The executable itself.
add_executable  ( delaunay_voronoi_cg delaunay_voronoi.cg.cpp ${D_UI_FILES} ${CGAL_Qt5_RESOURCE_FILES} ${D_RES_FILE})
target_link_libraries( delaunay_voronoi_cg PRIVATE CGAL::CGAL CGAL::CGAL_Qt5 Qt5::Widgets)

add_to_cached_list( CGAL_EXECUTABLE_TARGETS delaunay_voronoi_cg )

cgal_add_compilation_test(delaunay_voronoi_cg)

else()
  
    message(STATUS "This program requires the CGAL library, and will not be compiled.")
  
endif()

